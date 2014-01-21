image_stack = []

socket = io.connect();

socket.on('connect', ->
  $('#status').html 'connected'
)

refresh_block = (msgdata) ->
  block = $('#msg'+msgdata.id)

  if block.length is 0
      block = $('<div><a href="" target="_blank"><img src=""></a><span class="likes"></span><span class="tags"></span><span class="comments"></span></div>').attr('id', 'msg'+msgdata.id)
      $('#live').prepend(block)
      #

  block.find('a').attr('href', msgdata.link)
  block.find('img').attr('src', msgdata.images.low_resolution.url)
  block.find('span.likes').html( msgdata.likes.count)
  block.find('span.tags').html( msgdata.tags.join ', ')
  block.find('span.comments').html(msgdata.comments.data[msgdata.comments.count-1].text) if msgdata.comments.count > 0
  block.show(300)
  if $('#live > div').length > 100
    $('#live > div:last').remove();
  0

socket.on('message', (msg) ->
  console.log msg

  #image.src = msg.message.data[0].images.low_resolution.url

  refresh_block data for data in msg.message.data when not  undefined

  # $('#live').append( image  )
)