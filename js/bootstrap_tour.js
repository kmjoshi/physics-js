// Instance the tour
var tour = new Tour({
  steps: [
  {
    element: "#home",
    title: "Title of my step",
    content: "Content of my step"
  },
  {
    element: "#intro",
    title: "Title of my step",
    content: "Content of my step"
  }
]});

// Initialize the tour
tour.init();

// Start the tour
tour.start(true);
