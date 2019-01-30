$(document).ready( initializeApp );

function initializeApp(){
      getData();
      $('body').on('click', '#updateModal', function(event) {
            if ($(event.target).attr('id') === 'updateModal') {
                  handleCancelUpdate();
            }
      });
      $('body').on('click', '#deleteModal', function(event) {
            if ($(event.target).attr('id') === 'deleteModal') {
                  handleCancelDelete();
            }
      });
}

// Globals

var student_array = [];
var update_student_id = null;
var delete_student = null;
var delete_target = null;

// Functions

function handleAddClicked(){
      addStudent();
}

function handleCancelClick(){
      clearAddStudentFormInputs();
      resetErrors();
}

function handleEditClick( student ){
      // $("#updateModal").modal({backdrop: "static"});
      $(".container").addClass("sgt-main-blur");
      $("#update-modal-name").text(`${student.name}`);
      $('#updateName').val(student.name);
      $('#updateCourse').val(student.course);
      $('#updateGrade').val(student.grade);
}

function handleUpdateClick(){
      var updateName = $('#updateName').val();
      var updateCourse = $('#updateCourse').val();
      var updateGrade = $('#updateGrade').val();

      if(!updateInputTests( updateName, updateCourse, updateGrade )){
            return
      }

      updateData( update_student_id, updateName, updateCourse, updateGrade );
      update_student_id = null;

      $(".container").removeClass("sgt-main-blur");
      $('#updateModal').modal('hide');
}

function handleCancelUpdate(){
      $(".container").removeClass("sgt-main-blur");
      update_student_id = null;
      resetErrors();
}

function handleDeleteModalClick(student, target){
      $(".container").addClass("sgt-main-blur");
      $("#delete-modal-name").text(`${student.name}`);
      $("#deleteStudentName").val(student.name);
      $("#deleteStudentCourse").val(student.course);
      $("#deleteStudentGrade").val(student.grade);
      delete_student = student;
      delete_target = target;
}

function handleDeleteClick(){
      deleteData(delete_student.id, delete_student, delete_target, student_array);
      $(".container").removeClass("sgt-main-blur");
      delete_student = null;
      delete_target = null;
}

function handleCancelDelete(){
      $(".container").removeClass("sgt-main-blur");
      delete_student = null;
      delete_target = null;
}

function addStudent(){
      var studentName = $('#studentName').val();
      var studentCourse = $('#course').val();
      var studentGrade = $('#studentGrade').val();

      if(!addInputTests( studentName, studentCourse, studentGrade )){
            return
      }

      addData(studentName, studentCourse, studentGrade);
}


function resetErrors(){
      $('.error-name').text('');
      $('.error-course').text('');
      $('.error-grade').text('');
      $('.error-updateName').text('');
      $('.error-updateCourse').text('');
      $('.error-updateGrade').text('');
}

function clearAddStudentFormInputs(){
      $('#studentName').val('');
      $('#course').val('');
      $('#studentGrade').val('');
}

function renderStudentOnDom( studentList ){
      $('.student-list tbody').empty();

      for (var i=0; i<studentList.length; i++){
      
      var editButton = $('<button>', {
            'type': 'button',
            'text': 'edit',
            'class': 'btn btn-warning btn-xs',
            'data-toggle': 'modal',
            'data-target': '#updateModal'
      });

      (function( button, index ){
            var student = student_array[index];
            button.click(function(){
                  handleEditClick(student);
                  update_student_id = student.id  
            });
      })( editButton, i );
   
      var deleteButton = $('<button>', {
            'type': 'button',
            'text': 'delete',
            'class': 'btn btn-danger btn-xs',
            'data-toggle': 'modal',
            'data-target': '#deleteModal'
      });

      (function( button, index ){
            var student = student_array[index];
            button.click(function(){
                  handleDeleteModalClick( student, event.currentTarget )
            });
      })( deleteButton, i );

      var tableDataName = $('<td>').append(studentList[i]['name']);
      var tableDataCourse = $('<td>').append(studentList[i]['course']);
      var tableDataGrade = $('<td>').append(studentList[i]['grade']);
      var tableRowEdit = $('<td>').append(editButton);
      var tableRowDelete = $('<td>').append(deleteButton);
      var tableRow = $('<tr>').append(tableDataName, tableDataCourse, tableDataGrade, tableRowEdit, tableRowDelete);
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

// Regex Test for Inputs

var rawRegex = {
      nameRegex: /^[A-Za-z ]{2,25}$/,
      gradeRegex: /^[0-9][0-9]?$|^100$/
}

function regexTest(str, regEx, caseSensitive = false) {
      if (!caseSensitive) {
          str = String(str).toLowerCase();
      }
      return regEx.test(str);
}

function addInputTests( name, course, grade ){
      var errors = 0;

      if ( !regexTest( name, rawRegex.nameRegex )){
            $('.error-name').text('Needs to be at least 2 characters. Letters only.');
            errors++;
      } else {
            $('.error-name').text('');
      }
      
      if ( !regexTest( course, rawRegex.nameRegex )){
            $('.error-course').text('Needs to be at least 2 characters. Letters only.');
            errors++;
      } else {
            $('.error-course').text('');
      }

      if ( !regexTest( grade, rawRegex.gradeRegex )){
            $('.error-grade').text('Needs to be a whole number between 0 and 100.');
            errors++;
      } else {
            $('.error-grade').text('');
      }

      if( errors > 0){
            return false;
      }

      resetErrors();
      return true;
}

function updateInputTests( name, course, grade ){
      var errors = 0;

      if ( !regexTest( name, rawRegex.nameRegex )){
            $('.error-updateName').text('Needs to be at least 2 characters. Letters only.');
            errors++;
      } else {
            $('.error-updateName').text('');
      }
      
      if ( !regexTest( course, rawRegex.nameRegex )){
            $('.error-updateCourse').text('Needs to be at least 2 characters. Letters only.');
            errors++;
      } else {
            $('.error-updateCourse').text('');
      }

      if ( !regexTest( grade, rawRegex.gradeRegex )){
            $('.error-updateGrade').text('Needs to be a whole number between 0 and 100.');
            errors++;
      } else {
            $('.error-updateGrade').text('');
      }

      if( errors > 0){
            return false;
      }

      resetErrors();
      return true;
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

// AJAX Calls

      // Get list from DB

function getData(){
      var key = {api_key:'root'}
      var ajaxConfig = {
            data: key,
            dataType: 'json',
            method: 'GET',
            url: 'php/index.php?action=read',
            success: function(result) {
            student_array=[];
            for (var x=0; x < result.students.length; x++){
                  var tempObj={
                        'id': null,
                        'name': null,
                        'course': null,
                        'grade': null
                  }
                  tempObj['id'] = result.students[x]['id'];
                  tempObj['name'] = result.students[x]['name'];
                  tempObj['grade'] = result.students[x]['grade'];
                  tempObj['course'] = result.students[x]['course'];
                  student_array.push(tempObj);
            }
            updateStudentList(student_array);
            console.log('Current students in DB:', result);
            }

    }
    $.ajax(ajaxConfig);
}

      // Add a student to DB

function addData( name, course, grade ){
      $.ajax({
            dataType: 'json',
            data: {
                  'api_key': 'root',
                  'name': name,
                  'course': course,
                  'grade': grade,
                  },
            method: 'POST',
            url: 'php/index.php?action=create',
            success: function(result){
                  // Why is this happening???!?!?
                  console.log('SUCCESSS!!');
                  clearAddStudentFormInputs();
                  getData();
                  },
            error: function(result){
                  console.log('Error triggered!')
                  }
      })
}

      // Update student in DB

function updateData( id, name, course, grade ){
      $.ajax({
            dataType: 'json',
            data: {
                  'api_key': 'root',
                  'id': id,
                  'name': name,
                  'course': course,
                  'grade': grade,
                  },
            method: 'POST',
            url: 'php/index.php?action=update',
            success: function(result){
                  if (result.success === false){
                        for(var errorMsg=0; errorMsg< result.errors.length; errorMsg++){
                              alert(result.errors[errorMsg]);
                        }
                        return;
                  } else if (result.success === true){
                        for (var i=0; i<student_array.length; i++){
                              if (student_array[i].id === id){
                                    student_array[i].name = name;
                                    student_array[i].course = course;
                                    student_array[i].grade = grade;
                              }
                        }
                  }
                  
                  updateStudentList( student_array );
                  },
            error: function(result){
                  console.log('Update error triggered!');
            }
      })
}

      // Remove a student from DB

function deleteData( id, student, location, studentList){
      $.ajax({
            dataType: 'json',
            data:{
                  'api_key': 'root',
                  'id': id
                  },
            method: 'POST',
            url: 'php/index.php?action=delete',
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

