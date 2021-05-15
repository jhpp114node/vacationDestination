import API_KEYS from "../config.js";

// Global URL image
const DEFAULT_PHOTO_URL =
  "https://images.unsplash.com/photo-1504150558240-0b4fd8946624?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8dHJhdmVsfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60";

const DEFAULT_DESCRIPTION = " ";
const API_END_POINT = "https://api.unsplash.com/";

// Global DOM
const formSubmitForm = document.querySelector("#destination_form");
formSubmitForm.addEventListener("submit", handleSubmit);

async function handleSubmit(event) {
  event.preventDefault();
  const { destination, location, photoURL, description } = retrieveUserInput();
  console.log(photoURL);
  console.log(await fetchImage(photoURL));
  let photoData = await fetchImage(photoURL);
  createBootstrapCard(destination, location, photoData, description);
  resetForm(event);
}

// dynamic handler
document
  .querySelector(".added_data_row_container")
  .addEventListener("click", function (event) {
    console.log(event.target.classList.contains("remove_btn"));
    if (event.target.classList.contains("remove_btn")) {
      console.log("delete btn clicked");
      deleteItem(event);
    } else if (event.target.classList.contains("edit_btn")) {
      console.log("edit btn clicked");
      editItem(event);
    }
  });

const retrieveUserInput = () => {
  // Lists of Dom with value
  const destination = document.querySelector("#destination_name").value;
  console.log(destination);
  const location = document.querySelector("#location_name").value;
  const photoUserInput = `${destination.trim()},${location.trim()}`;
  const photoURL = imageHandler(photoUserInput);
  const description = descriptionHandler(
    document.querySelector("#description").value
  );
  return { destination, location, photoURL, description };
};

// =============================================
// Helper Function =============================
const imageHandler = (photo) => {
  if (photo === undefined || photo.length === 0 || photo === null) {
    console.log("wtf??");
    return (photo = DEFAULT_PHOTO_URL);
  }
  return photo;
};

// fetch data from api
function fetchImage(photoURL) {
  const requestImage = fetch(
    `${API_END_POINT}search/photos/?query=${photoURL}&client_id=${API_KEYS.unsplash}`
  ).then((response) => {
    if (response.status === 200) {
      // do something
      return response.json();
    } else {
      fetchError(response);
    }
  });
  return requestImage
    .then((data) => {
      return data.results;
    })
    .then((result) => {
      if (result.length == 0) {
        fetchError();
      }
      console.log(result);
      return result[Math.floor(Math.random() * result.length)].urls.regular;
    })
    .catch((error) => {
      console.log(error);
      return DEFAULT_PHOTO_URL;
    });
}

const fetchError = (res) => {
  return Promise.reject("Error on API fetch" + res.status);
};

const descriptionHandler = (description) => {
  if (
    description === undefined ||
    description.length === 0 ||
    description === null
  ) {
    description = DEFAULT_DESCRIPTION;
    console.log(description);
    return description;
  }
  return description;
};

// create cards
const createBootstrapCard = (destination, location, photoURL, description) => {
  // Container DOM
  // USE innerHTML NEXT TIME fk this
  const rowContainer = document.querySelector(".added_data_row_container");

  const cardParent = document.createElement("div");
  cardParent.setAttribute("class", "card");
  cardParent.setAttribute("style", "width: 15rem;");

  const cardImage = document.createElement("img");
  cardImage.setAttribute("src", photoURL);
  cardImage.setAttribute("class", "card-img-top");
  cardImage.setAttribute("alt", "cool place image");

  const cardBody = document.createElement("div");
  cardBody.setAttribute("class", "card-body");

  const cardTitle = document.createElement("h5");
  const cardTitleTextNode = document.createTextNode(destination);
  cardTitle.setAttribute("class", "card-title");
  cardTitle.appendChild(cardTitleTextNode);

  const cardSubTitle = document.createElement("h6");
  cardSubTitle.setAttribute("class", "card-subtitle mb-2 text-muted");
  const cardSubTitleTextNode = document.createTextNode(location);
  cardSubTitle.appendChild(cardSubTitleTextNode);

  const cardText = document.createElement("p");
  cardText.setAttribute("class", "card-text");
  const cardTextTextNode = document.createTextNode(description);
  cardText.appendChild(cardTextTextNode);

  // two buttons with container
  const editBtn = document.createElement("button");
  editBtn.setAttribute("class", "btn btn-warning list_btn edit_btn");
  editBtn.textContent = "Edit";
  const removeBtn = document.createElement("button");
  removeBtn.setAttribute("class", "btn btn-danger list_btn remove_btn");
  removeBtn.textContent = "Remove";
  const buttonContainer = document.createElement("div");
  buttonContainer.setAttribute("class", "added_button_container");
  buttonContainer.appendChild(editBtn);
  buttonContainer.appendChild(removeBtn);

  // organize the code
  cardBody.appendChild(cardTitle);
  cardBody.appendChild(cardSubTitle);
  cardBody.appendChild(cardText);
  cardBody.appendChild(buttonContainer);
  cardParent.appendChild(cardImage);
  cardParent.appendChild(cardBody);
  rowContainer.appendChild(cardParent);
};

// Edit button
async function editItem(event) {
  const parentDiv = event.target.parentElement.parentElement;
  let userInputDestination = prompt("Enter a new destination");
  let userInputLocation = prompt("Enter a new location");
  let userInputImage = "";
  let userImageData = "";
  if (
    userInputDestination !== null &&
    userInputDestination !== undefined &&
    userInputDestination.length > 0 &&
    userInputLocation !== null &&
    userInputLocation !== undefined &&
    userInputLocation.length > 0
  ) {
    userInputImage = `${userInputDestination}, ${userInputLocation}`;
    userImageData = await fetchImage(userInputImage);
  }

  let userInputDescription = prompt("Enter a description");
  console.log(userInputDestination);
  if (
    userInputDestination !== null &&
    userInputDestination !== undefined &&
    userInputDestination.length > 0
  ) {
    console.log("Asdfasdf");
    console.log(parentDiv.childNodes[0]);
    parentDiv.childNodes[0].textContent = userInputDestination;
  }
  if (
    userInputLocation !== null &&
    userInputLocation !== undefined &&
    userInputLocation.length > 0
  ) {
    parentDiv.childNodes[1].textContent = userInputLocation;
  }

  if (
    userImageData !== null &&
    userImageData !== undefined &&
    userImageData.length > 0
  ) {
    parentDiv.parentElement.childNodes[0].setAttribute("src", userImageData);
  }

  if (
    userInputDescription !== null &&
    userInputDescription !== undefined &&
    userInputDescription.length > 0
  ) {
    userInputDescription = descriptionHandler(userInputDescription);
    console.log(parentDiv.childNodes[2]);
    parentDiv.childNodes[2].textContent = userInputDescription;
  }
}

// Delete button
const deleteItem = (event) => {
  event.target.parentElement.parentElement.parentElement.remove();
};

// reset
const resetForm = (event) => {
  // console.log(event.target.destination_name);
  event.target.destination_name.value = "";
  event.target.location_name.value = "";
  // event.target.photo_url.value = "";
  event.target.description.value = "";
};
