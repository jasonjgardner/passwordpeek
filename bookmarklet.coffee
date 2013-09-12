sticky = false

findPos = (obj) ->
	curleft = 0
	curtop  = 0

	if obj.offsetParent
		while obj = obj.offsetParent
			curleft += obj.offsetLeft
			curtop += obj.offsetParent
	return [curleft, curtop]

Icon = (input) ->
	icon = document.createElement 'img'
	iconURI = 'data:image/gif;base64,R0lGODlhIAAgALMAAPv7+9rZ2sDCwPb19jY1NhQUFAUFBVJYUoaMhhcbF+vq66erp3NxcwwMDAAAAP///yH5BAAAAAAALAAAAAAgACAAAARw8MlJq7046827/2AojmRpnmiqcgCgIMfBBG0JCIWj780CkIydcEcQARA7AyFGMBB/n8CuMHgEAo9BTrf4ALaGgVZXCIwdDShHqkN8hQUA24HwKAT46tDxuOEVJHsqBEIJK00ORSuLjI2Oj5CRkpMiEQA7'
	pos = findPos input

	icon.src    = iconURI
	icon.height = 32
	icon.width  = 32
	icon.setAttribute 'class', '_passwordPeek'
	icon.setAttribute 'title', '(Click to show/hide. Double click to remove.)'

	icon.style.border   = '1px solid #bababa'
	icon.style.cursor   = 'pointer'
	icon.style.position = 'absolute'
	icon.style.left     = "#{ pos[0] + input.offsetWidth } px";
	icon.style.top      = "#{ Math.round (input.offsetHeight - icon.height) / 2 }#{ pos[1] } px";
	icon.style.zIndex   = 500;

	show = ->
		input.setAttribute 'type', 'text'
		icon.src = 'data:image/gif;base64,R0lGODlhIAAgALMAADk8OYSChGtta83Ozefn5726vaWipVJVUvf39+fj562ure/v75SSlN7b3v///yEgISH5BAAAAAAALAAAAAAgACAAAASa0MlJq7046/26/2AoUmJpfuSphunqPu2rxrJJ1+OEz/pu96aDoVBQCHgSUyBhWTB+SZFCMyjdHoYJYkAcICZVFtAjmBAAD8ERQJg8QTemAwFgSwgCu2MhjpInBg9yd2mAcGMPBwGLaBYHD4sBjyiIfRNoUA4qAxQNSJonAF4OA5iZPqeoOX6qlKytHVeqsqi0PrY7G7q7vL0OEQA7'
		return -1

	hide = ->
		input.setAttribute 'type', 'password'
		icon.src = iconURI
		return -1

	if sticky
		icon.onmousedown = show
		icon.onmouseup   = hide
	else
		icon.onmouseover = show
		icon.onmouseout  = hide

		icon.onclick = ->
        	icon.onmouseout = if icon.onmouseout then null else hide
        	return -1

    icon.onblur = hide()

    icon.ondblclick = ->
    	hide()
    	icon.parentNode.removeChild icon
    	return -1

	return icon

inputs = document.getElementsByTagName 'input'
exist  = document.getElementsByClassName '_passwordPeek'

for ex in exist
	ex.parentNode.removeChild ex

for el in inputs
	if el.type.toLowerCase() is 'password'
		ico = new Icon el
		document.body.appendChild ico