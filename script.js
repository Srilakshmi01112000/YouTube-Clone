
/**
 * 
 * searchString is the value typed by the user in the input box.
 * @param {String} searchString 
 */
document.addEventListener("DOMContentLoaded", async () => {
    const videos = await getRandomVideos();
    renderVideos(videos);
});
const searchButton = document.getElementById("search");
const searchInput = document.getElementById("search-input");
//container = document.getElementById("container");

searchButton.addEventListener("click", async () => {
    let searchString = searchInput.value.trim();
    if (searchString === "") {
        return;
    }
    const videos = await getSearchResults(searchString);
    renderVideos(videos);
});


async function getSearchResults(searchString) {
    // make a call to the search API and return the results from here.
    // data need to be sent: apiKey , searchString
    let url = `${baseUrl}/search?key=${apiKey}&q=${searchString}&part=snippet&maxResults=20`;
    const response = await fetch(url, { method: "GET" });
    const result = await response.json();
    return result.items;
}
// async function getSearchResults(searchString) {
//     let url = `${baseUrl}/search?key=${apiKey}&q=${searchString}&part=snippet&maxResults=20`;
//     try {
//         const response = await fetch(url);
//         if (!response.ok) {
//             throw new Error('Failed to fetch search results');
//         }
//         const result = await response.json();
//         return result.items;
//     } catch (error) {
//         console.error('Error fetching search results:', error);
//         return [];
//     }
// }

function renderVideos(videosList) {
    container.innerHTML = ''; // Clear previous search results
    if (!videosList || videosList.length === 0) {
        container.innerHTML = '<p>No videos found.</p>';
        return;
    }
    videosList.forEach((video) => {
        const { snippet } = video;

        const videoElement = document.createElement('div');
        videoElement.className = "video";
        videoElement.innerHTML = `
                    <img src="${snippet.thumbnails.high.url}" alt="${video.snippet.title}">
                    <p>${snippet.title}</p>
                    <b>${snippet.channelTitle}</b>
        `;

        videoElement.addEventListener('click', () => {
            localStorage.setItem('video_id', video.id.videoId);
            window.location.href = 'vedioDetails.html';
        });
        container.appendChild(videoElement);
    });
}
let firstScript = document.getElementsByTagName("script")[0];
firstScript.addEventListener("load", onLoadScript)
function onLoadScript() {
    if (YT) {
        new YT.Player("aravind", {
            height: "500",
            width: "850",
            videoId,
            events: {
                onReady: (event) => {
                    document.title = event.target.videoTitle;
                }
            }
        });
    }
}