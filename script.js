//apiKey = "AIzaSyDIhWr-fCOptDRRko9B86ReaTR88ii5SI4";
//baseUrl = `https://www.googleapis.com/youtube/v3`;
/**
 * 
 * searchString is the value typed by the user in the input box.
 * @param {String} searchString 
 */

const searchButton = document.getElementById("search") ;
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
    //console.log(result)
    //addDataOntoUI(result.items);
    // console.log("Search Query:", searchString);
    // console.log("Search Results:", result.items);
    return result.items;
}

function renderVideos(videosList) {
    container.innerHTML = ""; // Clear previous search results
   videosList.forEach((video) => {
        const {snippet} = video ;
        // const snippet = video.snippet

        const videoElement = document.createElement("div");
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
       // videosList.appendChild( videoElement)
        container.appendChild(videoElement);
   });
}
let firstScript = document.getElementsByTagName("script")[0] ;
firstScript.addEventListener("load", onLoadScript)
function onLoadScript() {
 	if (YT) {
    new YT.Player("aravind", {
 	height: "500",
 		width: "850",
 		videoId,
 		events: {
 			onReady: (event) => {
 				        document.title = event.target.videoTitle ;
 		       	   }
 	      }
 	   });
 	}
}