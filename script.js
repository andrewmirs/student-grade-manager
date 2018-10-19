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
      getData();
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
      sendData(studentName, studentCourse, studentGrade); 
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
          

                  deleteData(student.id, student, event.currentTarget, studentList);
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
    var ajaxConfig = {
        data: key,
        dataType: 'json',
        method: 'POST',
        url: 'http://s-apis.learningfuze.com/sgt/get',
        success: function(result) {
            for (var x=0; x < result.data.length; x++){
                  var tempObj={
                        'id': null,
                        'name': null,
                        'course': null,
                        'grade': null
                  }
                  tempObj['id'] = result.data[x]['id'];
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

function sendData( name, course, grade ){
      $.ajax({
      dataType: 'json',
      data: {
            'api_key': 'BZYxWVMCOE',
            'name': name,
            'course': course,
            'grade': grade,
            },
      method: 'POST',
      url: 'http://s-apis.learningfuze.com/sgt/create',
      success: function(result){
            if (result.success === false){
                  for(var errorMsg=0; errorMsg< result.errors.length; errorMsg++){
                        alert(result.errors[errorMsg]);
                  }
                  return;
            } 
            var studentObj = {
                  'name': name,
                  'course': course,
                  'grade': grade
                  }
            student_array.push( studentObj );
            clearAddStudentFormInputs();
            updateStudentList( student_array );
            student_array[student_array.length-1]['id'] = result.new_id;
            },
      error: function(result){
            console.log(result);
      }
      })
}

function deleteData( id, student, location, studentList){
      $.ajax({
            dataType: 'json',
            data:{
                  'api_key': 'BZYxWVMCOE',
                  'student_id': id
                  },
            method: 'POST',
            url: 'http://s-apis.learningfuze.com/sgt/delete',
            success: function(result){
                 if (result.success === false){
                       alert(result.errors[0]);
                       return;
                 }
                 removeStudent( student );
                 $(location).closest('tr').remove();
                 renderGradeAverage( calculateGradeAverage(studentList) );
            },
            error: function(result){
                  console.log(result);
            }
      })
}

