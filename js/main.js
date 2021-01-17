$(document).ready(function () {
  console.log("MAIN JS");

  let resultSize = 5;

  const someRandomString = "AIzaSyBkwMFQomrqATAAqtnoUSVb7F3twgdgdWY";
  const decrypted = CryptoJS.AES.decrypt(
    "U2FsdGVkX1+EhVZcXdmkqsjH2P8iEQxGeVK4znC+xLX1Dcfxa4j6eAKYeFioP4UQ2SyCRVSBeVyv4eZ7SAEM6g==",
    someRandomString
  );
  const randomString = decrypted.toString(CryptoJS.enc.Utf8);

  const width = $(window).width();

  $("body").on("click", "#youtube-videos .video", function () {
    $(".video-player").show();
    $(".video-player iframe").width(width - 20);
    $(".video-player iframe").height(width - 40);
    const videoId = $(this).attr("data-vId"),
      videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;

    $(".video-player iframe").attr("src", videoUrl);
  });

  $("body").on("click", ".close", () => {
    $(".video-player").hide();
    $(".video-player iframe").attr("src", "");
  });

  const getVideos = (resultSize) => {
    const YOUTUBE_API_URL = `https://www.googleapis.com/youtube/v3/search?key=${randomString}&channelId=UCvf3R42vyEY0Nr_yFjRCCyQ&part=snippet,id&order=date&maxResults=${resultSize}`;

    $.get(YOUTUBE_API_URL, (data) => {
      if (data && data.items && data.items.length) {
        const items = data.items;
        const itemsLength = items.length;
        $("#channel_name").text(items[0].snippet.channelTitle);
        let html = "";

        for (let index = 0; index < itemsLength; index++) {
          const element = items[index];

          html += `
              <div class="video" data-vId="${element.id.videoId}">
                <div class="thumb">
                  <img src="${element.snippet.thumbnails.medium.url}" alt="${element.snippet.description}" />
                </div>
                <div class="title">
                  <h2>
                    ${element.snippet.title}
                  </h2>
                </div>
              </div>
          `;
        }

        $("#youtube-videos").html(html);
      }
    });
  };

  getVideos(resultSize);

  $(window).scroll(function () {
    if (
      $(window).scrollTop() + $(window).height() >
      $(document).height() - 100
    ) {
      resultSize = resultSize + 5;
      getVideos(resultSize);
    }
  });
});
