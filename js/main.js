var index = function(){
  //localStorageにあればそちらのデータで初期化
  var todos = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : [];

  function getUniqueStr(myStrong){
    var strong = 1000;
    if (myStrong) strong = myStrong;
    return new Date().getTime().toString(16)  + Math.floor(strong*Math.random()).toString(16)
  }

  function refreshTodoList(){
    var todoHtml = '';
    for(var i = 0; i < todos.length; i++){
      todoHtml += '<div><p>';
      todoHtml += '<input type="checkbox" id="' + todos[i].id + '" class="filled-in" ';
      todoHtml += 'onchange="index.changeTodo(\'' + todos[i].id + '\');" ';
      todoHtml += (todos[i].checked ? 'checked="checked" />' : '/>');
      todoHtml += '<label for="' + todos[i].id + '">' + todos[i].name + '</label></p></div>';
    }
    $('#list').html(todoHtml);
    return;
  }

  function clearTodoInput(){
    $('#todoInput').val('');
    return;
  }
 
  return {
    popTodo: function(id){
      for(var i; i < todos.length; i++){
        if (todos[i].id === id) {
          todos.splice(i+1,1);
          break;
        }
      }
      this.saveTodos();
    },
    popAll: function(){
      todos = [];
      this.saveTodos();
      refreshTodoList();
    },
    pushTodo: function(e, name){
      if (e.key !== 'Enter') {
        return;
      }
      todos.push({id:getUniqueStr(), name:name});
      this.saveTodos();
      refreshTodoList();
      clearTodoInput();
    },
    changeTodo: function(id){
      todos = todos.map(function(i){
        if (i.id === id) {
          i.checked = $('#' + id).prop('checked');
        }
        return i;
      });
      this.saveTodos();
    },
    showTodoList: function(){
      refreshTodoList();
    },
    getTodoList: function(){
      return todos;
    },
    saveTodos: function(){
      try {
        localStorage.setItem('todos', JSON.stringify(todos));
      } catch (e) {
        return 'Exception Occured. Could not save todos.';
      }
    }
  };
}();

$(function(){
    index.showTodoList();
    $('.progress').hide();
    $('input').on('keydown', function(e){
      if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
        return false;
      }
      return true;
    });
});
$(window).on('beforeunload', function(e) {
  return index.saveTodos();
});
