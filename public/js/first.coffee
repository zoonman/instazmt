socket = io.connect();

socket.on('connect', ->
  $('#status').html 'connected'
)

socket.on('message', (data) ->
  console.log data
)