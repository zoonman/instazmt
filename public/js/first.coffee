socket = io.connect();

socket.on('connect', ->
  $('#status').html 'connected'
)