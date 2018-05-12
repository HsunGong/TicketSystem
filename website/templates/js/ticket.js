 
$(document).ready(function(){
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
	})
  	$(".available").on("click",function(){
		ob=find_avail(event.target);
		buy_option_resp(ob);
  });
	$(".train_id_info").click(function(){
		ob=event.target;
		while(! $(ob).hasClass('ticket_info'))
			ob = ob.parentNode;
		$(ob).next().slideToggle(200);
	})
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
