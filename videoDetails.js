const apiKey = "AIzaSyDIhWr-fCOptDRRko9B86ReaTR88ii5SI4";
const baseUrl = "https://www.googleapis.com/youtube/v3";
const videoId = localStorage.getItem('video_id');
const videoPlayer = document.getElementById('videoPlayer');
const videoStats = document.getElementById('videoStats');
const commentsDiv = document.getElementById('comments');

document.addEventListener("DOMContentLoaded", async () => {
    const videoDetails = await fetchVideoDetails(videoId);
    const videoStatistics = await fetchVideoStatistics(videoId)
    renderVideoPlayer(videoId);
    renderVideoStatistics(videoDetails, videoStatistics);
    const videoComments = await fetchVideoComments(videoId);
    renderVideoComments(videoComments);
});

async function fetchVideoDetails(videoId) {
    let url = `${baseUrl}/videos?key=${apiKey}&part=snippet&id=${videoId}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch video details');
        }
        const result = await response.json();
        return result.items[0];
    } catch (error) {
        console.error('Error fetching video details:', error);
        return null;
    }
}

async function fetchVideoStatistics(videoId) {
    let url = `${baseUrl}/videos?key=${apiKey}&part=statistics&id=${videoId}`;
    const response = await fetch(url);
    const result = await response.json();
    return result.items[0].statistics;
}

function renderVideoPlayer(videoId) {
    videoPlayer.innerHTML = `
        <div class="video-container">
            <iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
            <div class="video-controls">
               
                <!-- Add more control buttons here -->
            </div>
        </div>
    `;
}


function renderVideoStatistics(videoDetails, statistics) {
    videoStats.innerHTML = `
        <div class="statistics">
            <div class="left">
                <h2>${videoDetails.snippet.title}</h2>
                <p>Views: ${statistics.viewCount}</p>
                <div class="channel-container">
                    <div class="left">
                        <img src="${videoDetails.snippet.thumbnails.default.url}" alt="Channel Logo">
                        <div>
                            <p>Channel: ${videoDetails.snippet.channelTitle}</p>
                            <p>Published At: ${videoDetails.snippet.publishedAt}</p>
                        </div>
                    </div>
                    <div class="right">
                        <button class="sub">Subscribe</button>
                    </div>
                </div>
            </div>
            <div class="right">
                <div class="like-dislike">
                    <p><span class="material-icons">thumb_up</span> ${statistics.likeCount}</p>
                    <p><span class="material-icons">thumb_down</span> ${statistics.dislikeCount}</p>
                </div>
            </div>
        </div>
    `;
}

async function fetchVideoComments(videoId) {
    let url = `${baseUrl}/commentThreads?key=${apiKey}&part=snippet&videoId=${videoId}`;
    const response = await fetch(url);
    const result = await response.json();
    return result.items;
}

function renderVideoComments(videoComments) {
    const commentsDiv = document.getElementById('comments');
    commentsDiv.innerHTML = '<h2>Comments</h2>';

    videoComments.forEach(comment => {
        const commentItem = document.createElement('div');
        commentItem.className = 'comment-item';
        commentItem.innerHTML = `
            <div class="comment-header">
                <p><strong>${comment.snippet.topLevelComment.snippet.authorDisplayName}</strong></p>
                <p>${comment.snippet.topLevelComment.snippet.textOriginal}</p>
            </div>
            <button class="show-replies">Show Replies</button>
            <div class="replies">
                <!-- Reply comments will be rendered here -->
            </div>
        `;

        const showRepliesButton = commentItem.querySelector('.show-replies');
        const repliesDiv = commentItem.querySelector('.replies');

        showRepliesButton.addEventListener('click', async () => {
            if (repliesDiv.style.display === 'none') {
                const replyComments = await fetchVideoComments(comment.snippet.topLevelComment.id);
                repliesDiv.innerHTML = '';
                replyComments.forEach(reply => {
                    const replyItem = document.createElement('div');
                    replyItem.className = 'reply-item';
                    replyItem.innerHTML = `
                        <p><strong>${reply.snippet.authorDisplayName}</strong></p>
                        <p>${reply.snippet.textOriginal}</p>
                    `;
                    repliesDiv.appendChild(replyItem);
                });
                repliesDiv.style.display = 'block';
            } else {
                repliesDiv.style.display = 'none';
            }
        });
        commentsDiv.appendChild(commentItem);
    });
}

function renderReplyComments(replyComments, repliesDiv) {
    replyComments.forEach(reply => {
        const replyItem = document.createElement('div');
        replyItem.className = 'reply-item';
        replyItem.innerHTML = `
            <p><strong>${reply.snippet.authorDisplayName}</strong></p>
            <p>${reply.snippet.textOriginal}</p>
        `;
        repliesDiv.appendChild(replyItem);
    });
}




