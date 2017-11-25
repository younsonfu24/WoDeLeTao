$(function() {
	$('footer a').on('tap', function() {
		$(this).addClass('active').siblings().removeClass('active');
	});
});