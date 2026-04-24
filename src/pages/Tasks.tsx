import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '../supabase/client';
import { useI18n } from '../hooks/useI18n';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from '../components/LoginModal';
import type { Tables } from '../supabase/types';

type Task = Tables<'tasks'>;
type UserTask = Tables<'user_tasks'>;

interface TaskWithProgress extends Task {
  userTask?: UserTask;
}

export default function Tasks() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [tasks, setTasks] = useState<TaskWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [claimingTaskId, setClaimingTaskId] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      console.log('[Tasks] 开始获取任务...');
      console.log('[Tasks] Supabase URL:', supabase);
      
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('status', 1)
        .order('sort_order', { ascending: true });

      console.log('[Tasks] 获取tasks返回:', tasksData, tasksError);

      if (tasksError) {
        console.error('[Tasks] 获取tasks失败:', tasksError);
        throw tasksError;
      }

      console.log('[Tasks] 成功获取任务数:', tasksData?.length || 0);

      const { data: userTasksData, error: userTasksError } = await supabase
        .from('user_tasks')
        .select('*');

      console.log('[Tasks] 获取user_tasks返回:', userTasksData, userTasksError);

      const tasksWithProgress = (tasksData || []).map(task => ({
        ...task,
        userTask: userTasksData?.find(ut => ut.task_id === task.id)
      }));

      console.log('[Tasks] 设置任务列表:', tasksWithProgress);
      setTasks(tasksWithProgress);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (taskId: string) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    setClaimingTaskId(taskId);
    try {
      const { error } = await supabase
        .from('user_tasks')
        .update({ status: 2, claimed_at: new Date().toISOString() })
        .eq('task_id', taskId)
        .eq('user_id', user.id);

      if (error) {
        console.error('领取任务失败:', error);
        return;
      }

      const userTask = tasks.find(t => t.id === taskId)?.userTask;
      if (userTask) {
        await supabase.from('points_transactions').insert({
          user_id: user.id,
          type: 3,
          amount: tasks.find(t => t.id === taskId)?.reward_points || 0,
          balance_after: (user.points || 0) + (tasks.find(t => t.id === taskId)?.reward_points || 0),
          source_id: taskId,
        });
      }

      alert('领取成功！');
      fetchTasks();
    } catch (err) {
      console.error('领取异常:', err);
    } finally {
      setClaimingTaskId(null);
    }
  };

  const getTaskStatus = (userTask?: UserTask) => {
    if (!userTask) return { text: t('tasks.status.incomplete'), color: 'text-gray-400', bg: 'bg-gray-800' };
    if (userTask.status === 2) return { text: t('tasks.status.claimed'), color: 'text-green-400', bg: 'bg-green-500/20' };
    if (userTask.status === 1) return { text: t('tasks.status.claimable'), color: 'text-orange-400', bg: 'bg-orange-500/20' };
    return { text: t('tasks.status.inProgress'), color: 'text-blue-400', bg: 'bg-blue-500/20' };
  };

  const getTaskIcon = (type: number) => {
    switch (type) {
      case 1: return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 2: return <Clock className="w-5 h-5 text-blue-400" />;
      default: return <Gift className="w-5 h-5 text-orange-400" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-20 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-800 rounded w-1/3"></div>
            <div className="h-32 bg-gray-800 rounded"></div>
            <div className="h-32 bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">{t('tasks.title')}</h1>
          <p className="text-gray-400">{t('tasks.subtitle')}</p>
        </motion.div>

        <div className="space-y-4">
          {tasks.map((task, index) => {
            const status = getTaskStatus(task.userTask);
            const progress = task.userTask?.progress || 0;
            const target = task.userTask?.target || task.condition_value?.target || 1;

            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-orange-500/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center">
                    {getTaskIcon(task.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-semibold">{task.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs ${status.bg} ${status.color}`}>
                        {status.text}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{task.description}</p>

                    <div className="flex items-center gap-4 mb-3">
                      {task.reward_points && (
                        <span className="text-orange-400 text-sm">+{task.reward_points} {t('common.points')}</span>
                      )}
                      {task.reward_token && (
                        <span className="text-yellow-400 text-sm">+{task.reward_token} {t('common.token')}</span>
                      )}
                    </div>

                    {task.userTask && (
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>{t('tasks.progress')}</span>
                          <span>{progress}/{target}</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all"
                            style={{ width: `${Math.min((progress / target) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {task.userTask?.status === 1 && (
                      <button
                        onClick={() => handleClaim(task.id)}
                        disabled={claimingTaskId === task.id}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm font-medium disabled:opacity-50"
                      >
                        {claimingTaskId === task.id ? '领取中...' : '领取奖励'}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}
