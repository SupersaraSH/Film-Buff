const drawRating = (value) => {
  let text = "";

  for (let i = 0; i < 5; i++){
    if (i < value){
      text += "★";
    }
    else {
      text += "☆";
    }
  }

  return text;
}

module.exports = drawRating;