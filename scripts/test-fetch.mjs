#!/usr/bin/env node
/**
 * YouTube Metrics Fetcher - Test Run
 */

const YOUTUBE_API_KEY = 'AIzaSyDIXcWg_NHz2sPotg6aBsILOTHV_Ixz48I';
const CHANNEL_HANDLE = '@Shonsreviews';

async function fetchYouTubeMetrics() {
  try {
    // Get channel ID from handle
    const channelSearchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(CHANNEL_HANDLE)}&key=${YOUTUBE_API_KEY}`;
    
    const searchResponse = await fetch(channelSearchUrl);
    const searchData = await searchResponse.json();
    
    if (!searchData.items || searchData.items.length === 0) {
      throw new Error('Channel not found');
    }
    
    const channelId = searchData.items[0].id.channelId;
    
    // Fetch channel statistics
    const statsUrl = `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${channelId}&key=${YOUTUBE_API_KEY}`;
    
    const statsResponse = await fetch(statsUrl);
    const statsData = await statsResponse.json();
    
    if (!statsData.items || statsData.items.length === 0) {
      throw new Error('Channel statistics not available');
    }
    
    const channel = statsData.items[0];
    const stats = channel.statistics;
    
    // Fetch recent videos
    const videosUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&maxResults=5&type=video&key=${YOUTUBE_API_KEY}`;
    
    const videosResponse = await fetch(videosUrl);
    const videosData = await videosResponse.json();
    
    // Get video statistics for recent videos
    let recentVideos = [];
    if (videosData.items && videosData.items.length > 0) {
      const videoIds = videosData.items.map(v => v.id.videoId).join(',');
      const videoStatsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`;
      
      const videoStatsResponse = await fetch(videoStatsUrl);
      const videoStatsData = await videoStatsResponse.json();
      
      recentVideos = videosData.items.map((video, index) => {
        const vstats = videoStatsData.items?.find(v => v.id === video.id.videoId)?.statistics || {};
        return {
          title: video.snippet.title,
          publishedAt: video.snippet.publishedAt,
          views: vstats.viewCount || '0',
          likes: vstats.likeCount || '0',
          comments: vstats.commentCount || '0'
        };
      });
    }
    
    return {
      channelName: channel.snippet.title,
      subscribers: stats.subscriberCount || '0',
      totalViews: stats.viewCount || '0',
      totalVideos: stats.videoCount || '0',
      recentVideos
    };
    
  } catch (error) {
    console.error('Error fetching YouTube metrics:', error);
    throw error;
  }
}

async function generateReport() {
  const metrics = await fetchYouTubeMetrics();
  
  const date = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    timeZone: 'America/Chicago'
  });
  
  let report = `📊 YouTube Daily Metrics - ${date}\n\n`;
  report += `Channel: ${metrics.channelName}\n`;
  report += `Subscribers: ${parseInt(metrics.subscribers).toLocaleString()}\n`;
  report += `Total Views: ${parseInt(metrics.totalViews).toLocaleString()}\n`;
  report += `Total Videos: ${metrics.totalVideos}\n\n`;
  
  report += `Recent Videos:\n`;
  metrics.recentVideos.forEach((video, i) => {
    const published = new Date(video.publishedAt).toLocaleDateString('en-US', { timeZone: 'America/Chicago' });
    report += `${i + 1}. ${video.title.substring(0, 50)}${video.title.length > 50 ? '...' : ''}\n`;
    report += `   Views: ${parseInt(video.views).toLocaleString()} | Likes: ${parseInt(video.likes).toLocaleString()} | Comments: ${parseInt(video.comments).toLocaleString()} | ${published}\n\n`;
  });
  
  return report;
}

generateReport()
  .then(report => console.log(report))
  .catch(err => {
    console.error('Failed:', err.message);
    process.exit(1);
  });
