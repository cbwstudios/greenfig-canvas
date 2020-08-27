// JavaScript Document

$(document).ready(function()
{
	const currentCanvasURL = 'https://lms.ambi.school'
	const currentAmbiURL = 'https://greenfig.ambi.school'
	const currentLocation = window.location.href
	const isLogout = currentLocation === `${currentCanvasURL}/logout`
	const hasLogin = currentLocation.match(/login/g) != null
	const isCourse = currentLocation.match(/courses/g) != null
	const isProfile = currentLocation.match(/profile/g) != null
	const $body = $('body')
	const $sectionTabs = $('#section-tabs')
	const userRoles = {
		USER: 'user', // student
		TEACHER: 'teacher',
		ADMIN: 'admin',
		ROOT_ADMIN: 'root_admin'
	}
	
	// function loginPageTheme()
	// {
	// 	document.title = "ambi: the first Learning Social Network"
	// 	// // Start Login Video
	// 	// $('body.ic-Login-Body .ic-app').prepend('<video autoplay muted loop id="bgvid"><source
	// 	// src="https://www.dropbox.com/s/egf3eyu4ecx08li/GreenFig.mp4?dl=1" type="video/mp4"></video><div
	// 	// class="video-dottedoverlay"></div>'); var beepOne = $("#beep-one")[0]; $("#nav-one a").mouseenter(function
	// 	// () { beepOne.play(); }); End Login Video
	// }
	
	function addCalendarLinkItem(course_id)
	{
		const url = '/calendar?include_contexts=course_'+course_id
		
		if($sectionTabs.children().length < 1)
		{
			console.warn('No other links in menu')
			return
		}
		
		$sectionTabs.append(
			'<li class="section">' +
				'<a href="' + url + '" aria-label="Course Calendar" tabindex="0" title="Course Calendar">Calendar<i role="presentation"></i></a>' +
			'</li>')
	}
	
	function main()
	{
		console.log('ENV', ENV)
		
		// returns any one value of userType
		function getCurrentUserRole()
		{
			let currentRoles = ENV.current_user_roles
			
			if(currentRoles != null && currentRoles.length > 0)
			{
				var role = currentRoles.USER
				if(currentRoles.indexOf(currentRoles.TEACHER) !== -1 && currentRoles.length > 1)
				{
					role = currentRoles.TEACHER
					if(currentRoles.indexOf(currentRoles.ADMIN) !== -1 && currentRoles.length > 1)
					{
						role = currentRoles.ADMIN
					}
				}
				if(currentRoles.indexOf(currentRoles.ROOT_ADMIN) !== -1)
				{
					role = currentRoles.ROOT_ADMIN
				}
				return role
			}
			return 'default'
		}
		
		try
		{
			const user_role = getCurrentUserRole()
			$body.addClass('user_role_'+user_role)
			
			const match = location.pathname.split('/')
			
			if(!match || match.length === 0)
			{
				console.error('URL not recognized')
				$body.addClass('error')
				return
			}
			
			let section = match[1],
				course_id = match[2]
			
			if(section === '')
				section = 'root'
			
			$body.addClass('section_'+section)
			
			// Hide nav options always?
			$(`#global_nav_conversations_link`).hide()
			
			var handler = {
				[userRoles.USER]: function() { addCalendarLinkItem(course_id) },
				'default': function() {}
			}
			
			handler[user_role](section, course_id, user_role)
		}
		catch(e)
		{
			console.error(e.message, e.stack)
		}
		finally
		{
			$body.addClass('loaded')
		}
	}
	
	return main()
})
