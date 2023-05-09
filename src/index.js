import Notiflix from "notiflix";
const searchParams = new URLSearchParams({
    key: "36237308-42aa754ef31b34db7b4fcf11d",
    image_type: "photo",
    orientation: "horizontal",
    safesearch: "true",
    q: "mars",
    per_page: 40,
  });
  console.log(searchParams.toString())
  const url = `https://pixabay.com/api/?${searchParams}`
  console.log(url)

  function fetchImages(url){
    return fetch(`${url}`).then(response=>{
        if (!response.ok) {
            if (response.status === 404) {
              Notiflix.Notify.failure("Oops, there is no country with that name.");
            } else {
              throw new Error(response.status);
            }
          }
          return response.json();
        });
    }
  console.log(fetchImages(url))