const apiKey = "AIzaSyDIhWr-fCOptDRRko9B86ReaTR88ii5SI4";
const baseUrl = "https://www.googleapis.com/youtube/v3";
const videoId = localStorage.getItem('video_id');
const videoPlayer = document.getElementById('videoPlayer');
const videoStats = document.getElementById('videoStats');
const commentsDiv = document.getElementById('comments');

document.addEventListener("DOMContentLoaded", async () => {
    // Fetch video details and statistics
    const videoDetails = await fetchVideoDetails(videoId);
    const videoStatistics = await fetchVideoStatistics(videoId);

    // Render video player and statistics
    renderVideoPlayer(videoId);
    renderVideoStatistics(videoDetails, videoStatistics);
    const homeButton = document.getElementById("homeButton");
    homeButton.addEventListener("click", () => {
        // Navigate to the home page (index.html)
        window.location.href = "index.html";
    });

    // Fetch and render video comments
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
        <iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
    `;
}

function renderVideoStatistics(videoDetails, statistics) {
    videoStats.innerHTML = `
    <h2>${videoDetails.snippet.title}</h2>
    <p>Views: ${statistics.viewCount}</p>
    <p>Likes: ${statistics.likeCount}</p>
    <p>Dislikes: ${statistics.dislikeCount}</p>
    <p>Channel: ${videoDetails.snippet.channelTitle}</p>
`;
}

async function fetchVideoComments(videoId) {
    let url = `${baseUrl}/commentThreads?key=${apiKey}&part=snippet&videoId=${videoId}`;
    const response = await fetch(url);
    const result = await response.json();
    return result.items;
}

function renderVideoComments(videoComments) {
    commentsDiv.innerHTML = '<h2>Comments</h2>';

    videoComments.forEach(comment => {
        const commentItem = document.createElement('div');
        commentItem.className = 'comment-item';
        commentItem.innerHTML = `
        <p><strong>${comment.snippet.topLevelComment.snippet.authorDisplayName}</strong></p>
        <p>${comment.snippet.topLevelComment.snippet.textOriginal}</p>
        <button class="show-replies">Show Replies</button>
        <div class="replies"></div>
    `;
        // Add a click event listener to load and render reply comments
        const showRepliesButton = commentItem.querySelector('.show-replies');
        showRepliesButton.addEventListener('click', async () => {
            const repliesDiv = commentItem.querySelector('.replies');
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
        });
        commentsDiv.appendChild(commentItem);
    });
}






// const apiKey = "AIzaSyDIhWr-fCOptDRRko9B86ReaTR88ii5SI4";
// const baseUrl =`https://www.googleapis.com/youtube/v3`;

// async function fetchVideoDetails(videoId) {
//     let url = `${baseUrl}/videos?key=${apiKey}&part=snippet,contentDetails,statistics&id=${videoId}`;
//     const response = await fetch(url, { method: "GET" });
//     const videoInfo = await response.json();
//     const channelDetails = await fetchChannelDetails(videoInfo.items[0].snippet.channelId);
//     addDeatailsOntoDOM(videoInfo, channelDetails);
//     return videoInfo.items[0];
// }

// async function fetchVideoComments(videoId) {
//     // const apiUrl = `https://www.googleapis.com/youtube/v3/commentThreads?key=${API_KEY}&part=snippet&videoId=${videoId}`;
//     const apiUrl = `${baseUrl}/commentThreads?key=${apiKey}&part=snippet&videoId=${videoId}`;
//     const response = await fetch(apiUrl);
//     const data = await response.json();
//     return data.items;
// }

// async function fetchReplyComments(commentId) {
//     const apiUrl = `${baseUrl}/comments?key=${apiKey}&part=snippet&parentId=${commentId}`;
//     const response = await fetch(apiUrl);
//     const data = await response.json();
//     return data.items;
// }



// async function renderVideoDetails() {
//     const videoPlayer = document.getElementById('videoPlayer');
//     const videoStats = document.getElementById('videoStats');
//     const commentsDiv = document.getElementById('comments');


//     const videoId = localStorage.getItem('video_id');
//     const videoDetails = await fetchVideoDetails(videoId);
//     const videoComments = await fetchVideoComments(videoId);

//     videoPlayer.innerHTML = `
//     <iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
//   `;

//     videoStats.innerHTML = `
//   <h2>${videoDetails.snippet.title}</h2>
//   <p>Views: ${videoDetails.statistics.viewCount}</p>
//   <p>Likes: ${videoDetails.statistics.likeCount}</p>
//   <p>Dislikes: ${videoDetails.statistics.dislikeCount}</p>
//   <p>Channel: ${videoDetails.snippet.channelTitle}</p>
// `;

//     commentsDiv.innerHTML = '<h2>Comments</h2>';


//     videoComments.forEach(comment => {
//         const commentItem = document.createElement('div');
//         commentItem.className = 'comment-item';
//         commentItem.innerHTML = `
//       <p><strong>${comment.snippet.topLevelComment.snippet.authorDisplayName}</strong></p>
//       <p>${comment.snippet.topLevelComment.snippet.textOriginal}</p>
//       <button class="show-replies">Show Replies</button>
//       <div class="replies"></div>
//     `;
//         // Add a click event listener to load and render reply comments


//         const showRepliesButton = commentItem.querySelector('.show-replies');
//         showRepliesButton.addEventListener('click', async () => {
//             const repliesDiv = commentItem.querySelector('.replies');
//             const replyComments = await fetchReplyComments(comment.snippet.topLevelComment.id);
//             repliesDiv.innerHTML = '';

//             replyComments.forEach(reply => {
//                 const replyItem = document.createElement('div');
//                 replyItem.className = 'reply-item';
//                 replyItem.innerHTML = `
//               <p><strong>${reply.snippet.authorDisplayName}</strong></p>
//               <p>${reply.snippet.textOriginal}</p>
//             `;
//                 repliesDiv.appendChild(replyItem);
//             });
//         });
//         commentsDiv.appendChild(commentItem);

//     });
// }
// renderVideoDetails();


// // fetchVideoDetails();