import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize, List, MessageCircle, Send, User } from 'lucide-react';
import { supabase } from '../supabase/client';
import { useI18n } from '../hooks/useI18n';
import { useAuth } from '../contexts/AuthContext';

interface Episode {
  id: string;
  drama_id: string;
  episode_num: number;
  title: string | { zh: string; en: string };
  video_url: string | null;
  duration: number | null;
}

interface Comment {
  id: string;
  drama_id: string;
  user_id: string;
  episode_id: string | null;
  content: string;
  created_at: string;
  users?: {
    nickname: string;
    avatar: string;
  };
}

export default function DramaPlay() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const [drama, setDrama] = useState<any>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [showList, setShowList] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (id) {
      fetchDramaAndEpisodes();
      fetchComments();
    }
  }, [id]);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('drama_comments')
        .select('*, users(nickname, avatar)')
        .eq('drama_id', id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (!error && data) {
        setComments(data);
      }
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    }
  };

  const handleSubmitComment = async () => {
    if (!user) {
      alert(t('common.pleaseLogin'));
      return;
    }
    if (!newComment.trim()) {
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('drama_comments').insert({
        drama_id: id,
        user_id: user.id,
        episode_id: currentEpisode?.id || null,
        content: newComment.trim(),
      });

      if (error) {
        console.error('Failed to submit comment:', error);
        alert('Failed to submit comment');
      } else {
        setNewComment('');
        fetchComments();
      }
    } catch (err) {
      console.error('Submit comment error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const fetchDramaAndEpisodes = async () => {
    try {
      setLoading(true);
      const { data: dramaData } = await supabase
        .from('dramas')
        .select('*')
        .eq('id', id)
        .single();

      if (dramaData) {
        setDrama(dramaData);
        const { data: episodesData } = await supabase
          .from('episodes')
          .select('*')
          .eq('drama_id', id)
          .order('episode_num', { ascending: true });

        setEpisodes(episodesData || []);
        if (episodesData && episodesData.length > 0) {
          setCurrentEpisode(episodesData[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch drama:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = (title: any) => {
    if (typeof title === 'object' && title !== null) {
      return title[lang] || title.zh || '';
    }
    return String(title);
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!drama) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-gray-400">短剧不存在</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="relative bg-black">
        <a
          href="/drama"
          className="absolute top-20 left-4 z-10 p-2 bg-black/50 rounded-lg hover:bg-black/70 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </a>

        <div className="relative aspect-video bg-black flex items-center justify-center">
          {currentEpisode?.video_url ? (
            <video
              key={currentEpisode.id}
              src={currentEpisode.video_url || ''}
              className="w-full h-full object-contain"
              controls
              autoPlay
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              muted={muted}
            />
          ) : (
            <div className="text-center">
              <Play className="w-20 h-20 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">{t('drama.comingSoon') || '暂无播放地址'}</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-3 bg-gray-900">
          <button
            onClick={() => setShowList(!showList)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <List className="w-5 h-5" />
            <span>{t('drama.episodes') || '集'}</span>
          </button>
          <button
            onClick={() => setMuted(!muted)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>

        {showList && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-14 left-0 right-0 max-h-60 overflow-y-auto bg-gray-900 border-t border-gray-800"
          >
            <div className="grid grid-cols-4 gap-2 p-4">
              {episodes.map((ep) => (
                <button
                  key={ep.id}
                  onClick={() => {
                    setCurrentEpisode(ep);
                    setShowList(false);
                  }}
                  className={`p-2 rounded-lg text-sm transition-colors ${
                    currentEpisode?.id === ep.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {ep.episode_num}{t('drama.episodes') || '集'}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <div className="p-4">
        <h1 className="text-xl font-bold text-white mb-2">
          {getTitle(drama.title)}
        </h1>
        {currentEpisode && (
          <p className="text-gray-400">
            {currentEpisode.episode_num}{t('drama.episodes') || '集'} - {getTitle(currentEpisode.title)}
          </p>
        )}
      </div>

      <div className="border-t border-gray-800">
        <button
          onClick={() => setShowComments(!showComments)}
          className="w-full flex items-center justify-between px-4 py-3 text-gray-400 hover:text-white"
        >
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            <span>Comments ({comments.length})</span>
          </div>
          <span>{showComments ? '▲' : '▼'}</span>
        </button>

        {showComments && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-4 pb-4"
          >
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={user ? t('drama.commentPlaceholder') || 'Write a comment...' : t('common.pleaseLogin')}
                disabled={!user}
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment()}
              />
              <button
                onClick={handleSubmitComment}
                disabled={!user || !newComment.trim() || submitting}
                className="p-2 bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {comments.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No comments yet. Be the first!</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                      {comment.users?.avatar ? (
                        <img src={comment.users.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <User className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white text-sm font-medium">
                          {comment.users?.nickname || 'Anonymous'}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {formatTime(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm">{comment.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}