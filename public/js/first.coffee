image_stack = []

socket = io.connect();

socket.on('connect', ->
  $('#status').html 'connected'
)

socket.on('message', (msg) ->
  console.log msg
  image = new Image()
  image.src = msg.message.data[0].images.low_resolution.url
  $('#live').append( image  )
)