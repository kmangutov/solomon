var design = getUrlVars()["design"];


if(design === "a") {
  imgCondition = {
    imgUrl: "imgs/image-a.jpg",
    name: "a",
    description: "This is a poster advertising a dance show held by a University student organization. The target audience is University students interested in ballroom dancing."
  };
} else if(design === "b"){
  imgCondition = {
    imgUrl: "imgs/image-b.png",
    name: "b",
    description: "This is a website advertising a community college. The target audience is current and future students."
  };
} else if(design === "c") {
  imgCondition = {
    imgUrl: "imgs/image-c.png",
    name: "c",
    description: "This is an application that lets users transfer money to each other. The target audience is users interested in transferring money with friends."
  }; 
}