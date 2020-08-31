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
		USER: 'user',
		STUDENT: 'student',
		TEACHER: 'teacher',
		ADMIN: 'admin',
		ROOT_ADMIN: 'root_admin'
	}
	const currentRoles = ENV.current_user_roles
	
	function hasRole(role)
	{
		return currentRoles.find(function(r) { return r === role }) !== undefined
	}
	
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
				'<a href="' +url+ '" aria-label="Course Calendar" tabindex="0" title="Course Calendar">Calendar<i role="presentation"></i></a>' +
			'</li>')
	}
	
	function addHelpLinkItem(course_id, active)
	{
		const url = '/courses/'+course_id+'/pages/course-help'
		
		if($sectionTabs.children().length < 1)
		{
			console.warn('No other links in menu')
			return
		}
		
		let className = ''
		
		if(active)
		{
			const $foo = $sectionTabs.find('a.active')
				.removeClass('active')
			
			console.warn($foo)
			
			className = 'active'
		}
		
		const title = 'Course Help'
		$sectionTabs.append(
			'<li class="section">' +
				'<a href="' +url+ '" aria-label="' +title+ '" tabindex="0" title="' +title+ '" class="' +className+ '">' +title+ '<i role="presentation"></i></a>' +
			'</li>')
	}
	
	function main()
	{
		console.log('ENV', ENV)
		
		try
		{
			currentRoles.forEach(function(user_role)
			{
				$body.addClass('user_role_'+user_role)
			})
			
			$body.addClass('user_type_'+currentRoles[currentRoles.length-1])
			
			const match = location.pathname.split('/')
			
			if(!match || match.length === 0)
			{
				console.error('URL not recognized')
				$body.addClass('error')
				return
			}
			
			let section = match[1],
				course_id = parseInt(match[2]),
				subsection = 'none'
			
			if(section === '')
				section = 'root'
			else if(section === 'courses')
			{
				if(course_id)
					section = 'course'
				
				if(match[3])
					subsection = match.slice(3).join('_')
			}
			
			$body.addClass('section_'+section)
			$body.addClass('subsection_'+subsection)
			
			// Hide nav options always?
			$(`#global_nav_conversations_link`).hide()
			
			if(course_id)
			{
				if(hasRole(userRoles.STUDENT))
					addCalendarLinkItem(course_id)
				
				addHelpLinkItem(course_id, subsection === 'subsection_pages_course-help')
			}
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
