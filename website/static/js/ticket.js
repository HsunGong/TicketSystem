 
$(document).ready(function(){
	jQuery.fn.shake = function (intShakes /*Amount of shakes*/, intDistance /*Shake distance*/, intDuration /*Time duration*/) {  
		this.each(function () {  
			var jqNode = $(this);  
			jqNode.css({ position: 'relative' });  
			for (var x = 1; x <= intShakes; x++) {  
				jqNode.animate({ left: (intDistance * -1) }, (((intDuration / intShakes) / 4)))  
					.animate({ left: intDistance }, ((intDuration / intShakes) / 2))  
            	.animate({ left: 0 }, (((intDuration / intShakes) / 4)));  
        	}  
    });  
    return this;  
	};  
	function getByteLen(val) {
            var len = 0;
            for (var i = 0; i < val.length; i++) {
                 var a = val.charAt(i);
                 if (a.match(/[^\x00-\xff]/ig) !== null) 
                {
                    len += 2;
                }
                else
                {
                    len += 1;
                }
            }
            return len;
        }
	function login_input_check_len()
	{
		if(getByteLen($("#login_input").val()) > 20)
		{
			$("#login_error_message").html("邮箱或UID过长");
			$("#login_input").shake(10, 10, 500);
			return 0;
		}
		if(getByteLen($("#password_input").val()) > 20)
		{
			$("#login_error_message").html("密码过长");
			$("#password_input").shake(10, 10, 500);
			return 0;
		}
		$("#login_error_message").html("");
	}
	function login_input_check_empty()
	{
		if(getByteLen($("#login_input").val()) == 0)
		{
			$("#login_error_message").html("邮箱或UID不能为空");
			$("#login_input").shake(10, 10, 500);
			return 0;
		}
		if(getByteLen($("#password_input").val()) == 0)
		{
			$("#login_error_message").html("密码不能为空");
			$("#password_input").shake(10, 10, 500);
			return 0;
		}
		$("#login_error_message").html("");
		return 1;
	}
	$("#login_input, #password_input").blur(login_input_check_len);
	$("#login_button").click(function(){
		if(login_input_check_len() && login_input_check_empty)
		{
			
		}
	})
	$("#user_button").click(function(){
		if(! $("#user_button").hasClass("logged"))
			$(".login_window, .mask").fadeToggle();
	});
	$("#login_window_close").click(function(){
		$(".login_window, .mask").fadeToggle();
	});
	$(".train_info").hide();
	function find_avail(ob)
	{
		while(! $(ob).hasClass('available'))
			ob = ob.parentNode;
		return ob;
	}
  	$(".available").hover(function(){
		ob=find_avail(event.target);
		$(ob).addClass('hover');
	},function(){
		ob=find_avail(event.target);
		$(ob).removeClass('hover');
	});
	function buy_option_resp(ob)
	{
		if(! $(ob).hasClass('active'))
		{
			$(ob).addClass('active');
			$(ob).next().addClass('buy_option_slip_right');
			$(ob).next().removeClass('buy_option_slip_left');
		}
	  	else
		{
			$(ob).removeClass('active');
			$(ob).next().addClass('buy_option_slip_left');
			$(ob).next().removeClass('buy_option_slip_right');
		}
	}
	$(".buy_text_6").click(function(){
		ob=event.target;
		while(! $(ob).hasClass('seat_contain'))
			ob = ob.parentNode;
		ob=ob.firstChild;
		while(! $(ob).hasClass('available'))
			ob = $(ob).next().get(0);
		buy_option_resp(ob);
	});
  	$(".available").on("click",function(){
		ob=find_avail(event.target);
		buy_option_resp(ob);
  });
	$(".train_id_info").click(function(){
		ob=event.target;
		while(! $(ob).hasClass('ticket_info'))
			ob = ob.parentNode;
		$(ob).next().slideToggle(200);
	});
});

/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
} 
