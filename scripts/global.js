const hamburgerBtn = document.querySelector('.header__hamburger');
const body = document.body;
const header = document.querySelector('.header');
const fadeAniHam = document.querySelectorAll('.fade-ani-ham');

hamburgerBtn.addEventListener('click', () => {
	console.log('clicked');

	if(hamburgerBtn.classList.contains('active')){
		hamburgerBtn.classList.remove('active');
		body.classList.remove('no-scroll');
		header.classList.remove('active');
		fadeAniHam.forEach(function(fadeAni){
			fadeAni.classList.add('fade-out-ham');
			fadeAni.classList.remove('fade-in-ham');
		})
	}
	else{
		hamburgerBtn.classList.add('active');
		body.classList.add('no-scroll');
		header.classList.add('active');
		fadeAniHam.forEach(function(fadeAni){
			fadeAni.classList.add('fade-in-ham');
			fadeAni.classList.remove('fade-out-ham');
		})
	}
})