$(document).ready( initializeApp );

// Globals

var student_array=[];

/***************************************************************************************************
* initializeApp 
* @params {undefined} none
* @returns: {undefined} none
* initializes the application, including adding click handlers and pulling in any data from the server, in later versions
*/
function initializeApp(){
      addClickHandlersToElements();
}

/***************************************************************************************************
* addClickHandlerstoElements
* @params {undefined} 
* @returns  {undefined}
*     
*/
function addClickHandlersToElements(){
}

function handleAddClicked(){
      addStudent();
}

function handleCancelClick(){
      clearAddStudentFormInputs();
}

function addStudent(){
      var studentName = $('#studentName').val();
      var studentCourse = $('#course').val();
      var studentGrade = $('#studentGrade').val();
      var studentObj = {
            'name': studentName,
            'course': studentCourse,
            'grade': studentGrade
      }
      student_array.push( studentObj );
      clearAddStudentFormInputs();
      updateStudentList( student_array );
}

function clearAddStudentFormInputs(){
      $('#studentName').val('');
      $('#course').val('');
      $('#studentGrade').val('');
}

function renderStudentOnDom( studentList ){
      $('.student-list tbody').empty();

      for (var i=0; i<studentList.length; i++){
      var deleteButton = $('<button>', {
            'text': 'delete',
            'class': 'btn btn-danger btn-xs',
      });
      (function( button, index ){
            var student = student_array[index];
            button.click(function(){
                  removeStudent( student );
                  $(event.currentTarget).closest('tr').remove();
                  renderGradeAverage( calculateGradeAverage(studentList) );
            });
      })( deleteButton, i );
      var tableDataName = $('<td>').append(studentList[i]['name']);
      var tableDataCourse = $('<td>').append(studentList[i]['course']);
      var tableDataGrade = $('<td>').append(studentList[i]['grade']);
      var tableRowDelete = $('<td>').append(deleteButton);
      var tableRow = $('<tr>').append(tableDataName, tableDataCourse, tableDataGrade, tableRowDelete);
      $('.student-list').append(tableRow);
      }
}

function removeStudent( student ){
      var index = student_array.indexOf(student);
      console.log( index );
     if ( index === -1 ){
      return
     }
     student_array.splice(index,1);
}

function updateStudentList( studentList ){
      renderStudentOnDom( studentList );
      renderGradeAverage( calculateGradeAverage(studentList) );
  
}

// Calculate and Render Student Data

function calculateGradeAverage( studentList ){
      var gradesTotal = 0;
      for (var student=0; student<studentList.length; student++){
           gradesTotal += parseFloat( studentList[student].grade );
      }
      studentAvg = parseInt(gradesTotal/studentList.length);
      if (isNaN(studentAvg)){
            studentAvg = 0;
      }
      return studentAvg;
}

function renderGradeAverage( studentAvg ){
      $('.avgGrade').text( studentAvg );
}

// AJAX Call

function getData(){
      var key = {api_key:'BZYxWVMCOE'}
    console.log('1) getData called from button click');
    var ajaxConfig = {
        data: key,
        dataType: 'json',
        method: 'POST',
        url: 'http://s-apis.learningfuze.com/sgt/get',
        success: function(result) {
            console.log(result.data);
            var myJSON = JSON.stringify(result.data);
            console.log(result.data.length);
            for (var x=0; x < result.data.length; x++){
                  var tempObj={
                        'name': null,
                        'course': null,
                        'grade': null
                  }
                  tempObj['name'] = result.data[x]['name'];
                  tempObj['grade'] = result.data[x]['grade'];
                  tempObj['course'] = result.data[x]['course'];
                  student_array.push(tempObj);
            }
            updateStudentList(student_array);
        }
      
    }
    $.ajax(ajaxConfig);
}

