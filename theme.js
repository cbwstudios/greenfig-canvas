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
	
	function loginPageTheme()
	{
		document.title = "ambi: the first Learning Social Network"
		// // Start Login Video
		// $('body.ic-Login-Body .ic-app').prepend('<video autoplay muted loop id="bgvid"><source
		// src="https://www.dropbox.com/s/egf3eyu4ecx08li/GreenFig.mp4?dl=1" type="video/mp4"></video><div
		// class="video-dottedoverlay"></div>'); var beepOne = $("#beep-one")[0]; $("#nav-one a").mouseenter(function
		// () { beepOne.play(); }); End Login Video
	}
	
	function studentView()
	{
		try
		{
			const match = location.pathname.match(/\/courses\/(\d+)(\/.*)?/)
			let url = '/calendar?include_contexts=course_'
			
			if(!match || !match[1])
			{
				console.warn('URL not recognized')
				return
			}
			
			url = url + match[1]
			
			const $tabs = $('#section-tabs')
			
			if($tabs.children().length < 1)
			{
				console.warn('No other links in menu')
				return
			}
			
			$tabs.append(
				'<li class="section">' +
					'<a href="' + url + '" aria-label="Course Calendar" tabindex="0" title="Course Calendar">Calendar<i role="presentation"></i></a>' +
				'</li>')
		}
		catch(e)
		{
			console.error(e.message, e.stack)
		}
	}
	
	/**
	 * Add user role classname to body tag
	 */
	function setUserRoleClass(name)
	{
		$('body').addClass('user_role_'+name)
	}
	
	function hideNavOptions()
	{
		// hide sidebar nav links
		$(`.ic-app-header__menu-list li > #global_nav_conversations_link`).hide()
	}
	
	function userSpecificTheming()
	{
		console.log('ENV', ENV)
		
		var userType = {
			USER: 'user', // student
			TEACHER: 'teacher',
			ADMIN: 'admin',
			ROOT_ADMIN: 'root_admin'
		}
		
		var userRoles = ENV.current_user_roles
		
		function redirectToAMBI()
		{
			// Note : Even if the user is created as a teacher, he will be assigned with the user_role of userType.User
			// (student) untill he accepts his invitation to join a class as teacher. Only after accepting he will also
			// be given the role teacher. So better approach here might be to redirect user to ambi app inside the
			// canvas instead of redirecting to ambi.school. As of now redirecting to ambi.school if user is not on
			// oauth flow or login screen of canvas
			
			// if (!hasLogin && !isLogout && !isCourse && !isProfile) {
			//  window.location.href = `${currentAmbiURL}`;
			//}
			
			// in case of qizzes preview page we are making some sections hidden by default
			//if (currentLocation.match(/quizzes/g) != null || currentLocation.match(/take/g) != null) {
			//  $(`#wrapper > .ic-app-nav-toggle-and-crumbs,
			//   #header, #left-side.ic-app-course-menu`).hide();
			//}
		}
		
		// returns any one value of userType
		function getCurrentUserType()
		{
			if(userRoles != null && userRoles.length > 0)
			{
				var user = userType.USER
				if(userRoles.indexOf(userType.TEACHER) !== -1 && userRoles.length > 1)
				{
					user = userType.TEACHER
					if(userRoles.indexOf(userType.ADMIN) !== -1 && userRoles.length > 1)
					{
						user = userType.ADMIN
					}
				}
				if(userRoles.indexOf(userType.ROOT_ADMIN) !== -1)
				{
					user = userType.ROOT_ADMIN
				}
				return user
			}
			return 'default'
		}
		
		var userSpecificTheme = {
			[userType.USER]: function()
			{
				studentView()
				// return redirectToAMBI()
			},
			[userType.TEACHER]: function() { return hideNavOptions() },
			[userType.ADMIN]: function() {},
			[userType.ROOT_ADMIN]: function() {},
			'default': function() {}
		}
		
		console.log(getCurrentUserType())
		setUserRoleClass(getCurrentUserType())
		
		return userSpecificTheme[getCurrentUserType()]()
	}
	
	function main()
	{
		hideNavOptions()
		const isLoginPage = window.location.href === "https://lms.ambi.school/login/canvas"
		
		if(isLoginPage)
		{
			return loginPageTheme()
		}
		else
		{
			return userSpecificTheming()
		}
	}
	
	return main()
})
