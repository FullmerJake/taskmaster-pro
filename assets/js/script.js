var tasks = {};

var createTask = function(taskText, taskDate, taskList) {
  // create elements that make up a task item
  var taskLi = $("<li>").addClass("list-group-item");
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(taskDate);
  var taskP = $("<p>")
    .addClass("m-1")
    .text(taskText);

  // append span and p element to parent li
  taskLi.append(taskSpan, taskP);


  // append to ul list on the page
  $("#list-" + taskList).append(taskLi);
};

var loadTasks = function() {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  // if nothing in localStorage, create a new object to track all task status arrays
  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      inReview: [],
      done: []
    };
  }

  // loop over object properties
  $.each(tasks, function(list, arr) {
    console.log(list, arr);
    // then loop over sub-array
    arr.forEach(function(task) {
      createTask(task.text, task.date, list);
    });
  });
};

var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

//delegated <p> click
$('.list-group').on('click', 'p', function(){
  var text = $(this)
    .text()
    .trim();
    //var text = $(this).text().trim() is the same way to write the above code. 
    //putting methods on new line wil help increase readability.
  var textInput = $('<textarea>')
    .addClass('form-control')
    .val(text);
    // creates a new <p> element and gives it the class form-control, and adds the var text as its value. 

    //all of the above only exists in memeory, so we need to append it somewhere on the page. 
    //specifically, swapping out the existing <p> element with the new <textarea> element. 

  $(this).replaceWith(textInput);
  textInput.trigger('focus');
    

});

//Blur even triggers when the user interacts with anything other than the textarea element. 
$('.list-group').on("blur", 'textarea', function(){

  //Collects a few pieces of data: current value of the element, the parent element's ID, and the element's position in the lsit. 
  //Helps us update the correct task in the [tasks] object. 

  // get the textarea's current value/text
  var text = $(this)
    .val()
    .trim();

  //get the parent ul's id attribute
  var status = $(this)
    .closest('.list-group')
    .attr('id')
    //this is a regular Javascript method. You can chain regular JS and JQuery methods in our operations. 
    .replace('list-', '');

  //get the task's position in the list of of other li elements. 
  var index = $(this)
    .closest('.list-group-item')
    .index();

  tasks[status][index].text = text;
  saveTasks();

  //recreate <p> element
  var taskP = $("<p>")
    .addClass('m-1')
    .text(text);

  //replace textarea with p element
  $(this).replaceWith(taskP);
});

//changes date span element to an input element.
$('.list-group').on('click', 'span', function(){
  //get current text
  var date = $(this)
    .text()
    .trim();

  //create new input variable
  var dateInput = $('<input>')
    .attr('type', 'text')
    .addClass('form-control')
    .val(date);

  //swap out elements
  $(this).replaceWith(dateInput);

  //automatically focus on new element
  dateInput.trigger('focus');
});

//changes date input back in span, saving the changes to the element. 
$('.list-group').on("blur", "input[type='text']", function(){
    //get current text
    var date = $(this)
      .val()
      .trim();

    //get the parent's ul id Attribute
    var status = $(this)
      .closest('.list-group')
      .attr('id')
      .replace('list-', '');

    //get the task's position in the list of other elements
    var index = $(this)
      .closest('.list-group-item')
      .index();

    //recreate span element with bootstrap classes
    var taskSpan = $('<span>')
      .addClass('badge badge-primary badge-pill')
      .text(date);

    //replace input with span element
    $(this).replaceWith(taskSpan);

});

// modal was triggered
$("#task-form-modal").on("show.bs.modal", function() {
  // clear values
  $("#modalTaskDescription, #modalDueDate").val("");
});

// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function() {
  // highlight textarea
  $("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-primary").click(function() {
  // get form values
  var taskText = $("#modalTaskDescription").val();
  var taskDate = $("#modalDueDate").val();

  if (taskText && taskDate) {
    createTask(taskText, taskDate, "toDo");

    // close modal
    $("#task-form-modal").modal("hide");

    // save in tasks array
    tasks.toDo.push({
      text: taskText,
      date: taskDate
    });

    saveTasks();
  }
});

// remove all tasks
$("#remove-tasks").on("click", function() {
  for (var key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();
  }
  saveTasks();
});

// load tasks for the first time
loadTasks();


