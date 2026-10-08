var DVL={lang:function(e){return/^fr(-CA)?$/.test(e.documentElement.lang)||/\/francais\//.test(e.location.href)?"fr":"en"}(document),plugins:void 0!==DVL&&DVL.plugins||["breadcrumb","overlays","header","tabs"],init:function(){jQuery.getScripts({urls:_.map(DVL.plugins,function(e){return(/^\.\/|\.\.|\/|http/.test(e)?e:RBCDVL.theme_url+"/dvl/v1.0/assets/js/"+e)+".min.js"}),success:function(){},complete:function(){}}),DVL.fn.fixes(),DVL.fn.linkableTab(),DVL.fn.scrollTo(),DVL.fn.footerYear(),DVL.fn.equalHeight(),DVL.fn.tabbing()},device:{browser:function(e){return null==e?bowser.name:bowser[e]},os:function(e){return bowser[e]}},fn:{fixes:function(){jQuery("header").find(".mega-menu-wpr").length&&jQuery(".nav-bar").find(".nav-btn").hide();jQuery(".grid-half, .grid-three-fourths, .grid-two-thirds, .grid-one-fourth, .grid-one-third").each(function(){1<=jQuery(this).children(".callout").length&&jQuery(this).children(".callout").is(":only-child")&&jQuery(this).addClass("flex")}),DVL.device.os("ios")&&jQuery("html").addClass("ios"),bowser.ios&&"10.2.1"==bowser.osversion&&jQuery("html").addClass("ios10andless"),bowser.ipad&&bowser.version<10.3&&jQuery("html").addClass("ios10andless");var e=jQuery("span.tel-number");1<=e.length&&e.each(function(e,t){var n=jQuery(this),o=n.text();jQuery(window).width()<640&&n.html('<a href="tel:'+o+'">'+o+"</a>"),jQuery(window).resize(function(e){o=n.text(),jQuery(window).width()<640?n.html('<a href="tel:'+o+'">'+o+"</a>"):n.html(o)})}),jQuery(".tabs, .section-tabs, .side-menu-secondary-menu").each(function(){jQuery(this).find(".tab-nav > li.active > a").addClass("active")})},footerYear:function(){var e=(new Date).getFullYear();jQuery(".footer-year").text(e)},linkableTab:function(){var e=document.location.toString();e.match("#")&&jQuery('.tab-nav a[href="#'+e.split("#")[1]+'"]').tab("show"),jQuery(".tab-nav a").on("shown.bs.tab",function(e){history.pushState?history.pushState(null,null,e.target.hash):window.location.hash=e.target.hash})},scrollTo:function(){var n,o=jQuery(".nav-bar"),i=jQuery(".anchor-bar, .anchor-bar2"),e=jQuery(".tertiary-header"),a=0<o.length?o.outerHeight():0,r=0<i.length?i.outerHeight():0,s=0<e.length?e.outerHeight():0,l=a+r+s,e=(jQuery(document).on("click",".scrollto",function(e){e.preventDefault(),a=0<o.length?o.outerHeight():0,r=0<i.length?i.outerHeight():0,s=0<s.length?s.outerHeight():0,l=a+r+s;var e=jQuery(this).data("target"),e=void 0!==e&&!1!==e?jQuery(this).data("target"):jQuery(this).attr("href"),t=jQuery(e);0!==t.length&&t&&t.length&&((e=t.closest(".collapse-content"))&&e.length&&!e.hasClass("show")&&e.collapse("show"),n=t.offset().top-l,jQuery("body, html").animate({scrollTop:n},500),t.is(":focusable")||t.attr("tabindex","-1"),setTimeout(function(){t.focus()},400))}),!!navigator.userAgent.match(/Trident.*rv\:11\./));_anchorToTarget=function(){if(window.location.hash){var e=location.href.split("#")[1];if(/[^A-Za-z0-9 _,-]+/g.test(e))return!1;if(jQuery(location.href.split("#")[1])){e=jQuery("#"+location.href.split("#")[1]);if(e.length)return n=e.offset().top-l,jQuery("html, body").animate({scrollTop:n},500),(e.is(":focusable")?e:e.attr("tabindex","-1")).focus(),!1}}},e?_anchorToTarget():window.onload=function(){_anchorToTarget()}},tabbing:function(){function t(e){9===e.keyCode&&(document.body.classList.add("user-is-tabbing"),window.removeEventListener("keydown",t),window.addEventListener("mousedown",n))}function n(){document.body.classList.remove("user-is-tabbing"),window.removeEventListener("mousedown",n),window.addEventListener("keydown",t)}window.addEventListener("keydown",t)},appendOverlay:function(){jQuery("body").append('<div class="overlay"></div>').delay(1).queue(function(){jQuery(".overlay").addClass("overlay-visible"),jQuery(this).dequeue()}),jQuery("body").addClass("overlay-visible"),jQuery("header, main, footer").attr("aria-hidden","true")},removeOverlay:function(){jQuery(".overlay").removeClass("overlay-visible").delay(1).queue(function(){jQuery(this).remove(),jQuery(this).dequeue()}),jQuery("body").removeClass("overlay-visible"),jQuery("header, main, footer").removeAttr("aria-hidden")},equalHeight:function(){(_eh=function(){var e;0===jQuery(".eh-wpr").length||0!==(e=jQuery(".eh-wpr")).find(".eh").length&&e.each(function(e,t){var n=jQuery(this).find(".eh"),o=(n.css("min-height",0),n.map(function(){return jQuery(this).outerHeight()}).get()),o=Math.max.apply(null,o);n.css("min-height",o)})})(),jQuery(window).resize(function(e){_eh()})}},core:{getScripts:function(e){var t=[],n=e.urls;e.errorOccurred=!1;for(var o=function(){t.push(arguments),e.scriptsProcessed++,t.length===n.length&&"function"==typeof e.success&&e.success(jQuery.merge([],t))},i=function(){e.scriptsProcessed++,e.errorOccurred=!0},a=e.scriptsProcessed=0;a<n.length;a++)jQuery.getScriptCached({url:n[a],success:o,error:i,complete:e.complete.bind(e)})},getScriptCached:function(e){_.defaults(e,{dataType:"script",crossDomain:!0,async:!0,cache:!0}),jQuery.ajax(e)}}};jQuery.extend(DVL.core),jQuery(document).ready(DVL.init);;
(function($, window, document, undefined) {
	var $quizWpr = $(".rbc-wp-quiz-wpr");
	var currentStep = 0; //track steps of virtual pageview for pushDataLayerEvent
	var currentLocation = '';
	var previousLocation = '';
	var progressBarExists = false;

	function pushDataLayerEvent(eventType, details, dataDigId, questionNumberAndQuestion, selectedAnswer) {
    window.dataLayer = window.dataLayer || [];
		function getFullSanitizedUrl() {
			try {
					var origin = window.location.origin;
					var pathname = window.location.pathname.replace(/[^a-z0-9_\-\/]/gi, ''); // Sanitize pathname
					var search = window.location.search.replace(/[^a-z0-9_\-=&\/?]/gi, ''); // Sanitize search query
					var hash = window.location.hash;
	
					return `${origin}${pathname}${search}${hash}`;
			} catch (error) {
					console.error('Error constructing sanitized URL:', error);
					return '';
			}
	}

	function getBaseTitle(fullTitle) {
		return fullTitle.split(' - ')[0];
	}

	var currentPageUrl = getFullSanitizedUrl();
	var stepInfo = eventType === 'page_view' && !details.includes('results') ? "step" + currentStep : '';
	var pageTitle = document.title;
	var baseTitle = getBaseTitle(pageTitle);
	var pageTitleStep = baseTitle + (stepInfo ? ` - ${stepInfo}` : '');
	var fullPageLocation = currentPageUrl.endsWith('/') ? currentPageUrl + stepInfo : currentPageUrl + "/" + stepInfo;

	if (details.includes('result')) {
		pageTitleStep += ' - results';
		fullPageLocation = currentPageUrl + (currentPageUrl.endsWith('/') ? "" : "/") + "results";
	}

	var dataLayerObj = {
			event: eventType
	};

	// Only add page location and title for page_view events
	if (eventType === 'page_view') {
		previousLocation = currentLocation;
    currentLocation = fullPageLocation;
    dataLayerObj['page_location'] = fullPageLocation;
    dataLayerObj['page_title'] = pageTitleStep;
		dataLayerObj['page_referrer'] = previousLocation;
	} else {
		if (eventType !== 'field_submit' && eventType !== 'page_view') {
			dataLayerObj['details'] = details;
		}

			if (eventType === 'field_submit') {
					dataLayerObj['form_name'] = pageTitle;
					dataLayerObj['field_name'] = questionNumberAndQuestion;
					dataLayerObj['field_selection'] = selectedAnswer;
			} else if (eventType === 'click') {
				dataLayerObj['data_dig_id'] = dataDigId;
			}
	}

    window.dataLayer.push(dataLayerObj);
    // console.log('DataLayer Event Pushed:', dataLayerObj);
}

	//This function is in charge of datalayer push for questionnaire
	function initQuiz() {
		$('#start-quiz').on('click', function() {
			var pageTitle = document.title;
			var dataDigId = $quizWpr.data('quizzes-dig-id');
			pushDataLayerEvent('click', `${pageTitle} - start`, dataDigId);
			setTimeout(function() {
				currentStep = 1;
				pushDataLayerEvent('page_view', 'questionnaire – step ' + currentStep, '');
			}, 400);
		});

		$('.rbc-wp-quiz-question-wpr').each(function(index) {
			$(this).attr('data-question-num', index + 1);
		});

		$('.continue, .rbc-wp-quiz-results-btn').on('click', function() {
				var $currentQuestionWpr = $(this).closest('.rbc-wp-quiz-question-wpr');
				var currentQuestionId = $currentQuestionWpr.data('question-num');
				var isFinal = $(this).hasClass('rbc-wp-quiz-results-btn');
				var selectedAnswer = $currentQuestionWpr.find(".rbc-wp-quiz-question:checked").val();
    		var dataDigId = $currentQuestionWpr.data('question-dig-id');
				var allAnswers = [];
				var questionText = $currentQuestionWpr.find('.rbc-wp-quiz-question-text').text();
				var questionNumberAndQuestion = `question ${currentQuestionId} - ${questionText}`;
				var details = `question ${currentQuestionId} - ${questionText} - ${selectedAnswer}`;
				var pageTitle = document.title;
				var clickEventDetails = `${pageTitle} - show my results`;

			if (!isFinal) {
				currentStep++;
				setTimeout(function() {
					pushDataLayerEvent('page_view', details, '', questionNumberAndQuestion, selectedAnswer);
				}, 400);
				if (selectedAnswer) {
					pushDataLayerEvent('field_submit', details, dataDigId, questionNumberAndQuestion, selectedAnswer);
				}
			} else {
				setTimeout(function() {
					pushDataLayerEvent('page_view', `${details} – results`, '', questionNumberAndQuestion, selectedAnswer);
				}, 400);
				if (selectedAnswer) {
					pushDataLayerEvent('field_submit', details, dataDigId, questionNumberAndQuestion, selectedAnswer);
					setTimeout(function() {
						pushDataLayerEvent('click', clickEventDetails, dataDigId);
					}, 300);
				}
				}
			});
		}

	// Initializes the questionnaire events
	$(function() {
    var quizType = $quizWpr.data("quiz-type");
    if (quizType === "questionnaire") {
        initQuiz();
    }
	});

	function calculateQuizResults(quizType) {
    var results = {};
    var totalAnswers = 0;

    if (quizType === "questionnaire") {
        var chosenResultID = "";
        var mostFrequentAnswer = 0;
				var pageTitle = document.title;
				

        if (validateAnswers()) {
            $quizWpr.find(".rbc-wp-quiz-question:checked").each(function(i, el) {
                results[$(el).val()] = (results[$(el).val()] || 0) + 1;
                totalAnswers++;
            });

            let foundEqualAnswers = false;

						for (const r1 in results) {
              for (const r2 in results) {
                if (r1 !== r2 && results[r1] === results[r2]) {
                  foundEqualAnswers = true;

                if ( $( ".tie-result" ).length ) {
 
								var letter = $('.tie-result').attr('id').replace('result-', '');
								
								chosenResultID = letter;
                         
                } else {
                  if ( results[r1] > mostFrequentAnswer ) {
                    chosenResultID = r;
                    mostFrequentAnswer = results[r];
                    }
                  }

                    } else {
                      for ( var r in results ) {
                        if ( results[r] > mostFrequentAnswer ) {
                          chosenResultID = r;
                          mostFrequentAnswer = results[r];
                        }
                      }
                    }
                  }
                }
						
            $("#result-" + chosenResultID).addClass("show").siblings().removeClass("show");
						
						var resultElement = $('.rbc-wp-quiz-result.show').get(0);

				if (resultElement) {
						var resultId = resultElement.id;
						var lastCharacter = resultId.charAt(resultId.length - 1);
						var viewEventDetails = `${pageTitle} - Result variant ${lastCharacter}`;
						var clickEventDetails = `${pageTitle} - show my results`;

						setTimeout(function() {
							pushDataLayerEvent('view', viewEventDetails);	
						}, 350);
        }
      }
    } else if (quizType === "quiz" && typeof corans !== 'undefined') {
			if (validateAnswers()) {
				var pageTitle = document.title;
				var dataDigId = $quizWpr.data('quizzes-dig-id');
        var numCorrect = 0;
        var answerDetails = [];
				var totalAnswers = $('.rbc-wp-quiz-question-wpr').length;

        $('.rbc-wp-quiz-question-wpr').each(function(index, element) {
            var questionId = 'question' + (index + 1);
            var selectedOption = $(element).find(":checked").val();

            answerDetails.push(questionId + ':' + selectedOption);
            if (corans[questionId] && selectedOption === corans[questionId]) {
                numCorrect++;
            }
        });

				$(".rbc-wp-quiz-result").each(function(i, el) {
					var $el = $(el);

					if ( numCorrect >= +$el.data('min-score') && numCorrect <= +($el.data('max-score') || $quizWpr.data('num-questions')) ) {
						$el.addClass("show").find(".num-correct").text(numCorrect).end().find(".total-num").text(totalAnswers).end().siblings().removeClass("show");
						return false;
					}
				});

				var resultElement = $('.rbc-wp-quiz-result.show').get(0);

				if (resultElement) {
						var resultId = resultElement.id;
						var lastCharacter = resultId.charAt(resultId.length - 1);
						var viewEventDetails = `${pageTitle} - Result variant ${lastCharacter}`;
						var clickEventDetails = `${pageTitle} - show my results`;

						answerDetails.forEach(function(detail) {
							var [questionId, selectedOption] = detail.split(':');
							var questionText = $(`#${questionId} label`).first().text();
							var questionNumberAndQuestion = `Question ${questionId.replace('question', '')} - ${questionText}`;
            	var selectedAnswer = selectedOption;
							var details = `question ${questionId.replace('question', '')} - ${selectedAnswer}`;

							pushDataLayerEvent('field_submit', details, dataDigId, questionNumberAndQuestion, selectedAnswer);
						});

						pushDataLayerEvent('click', clickEventDetails, dataDigId);
						setTimeout(function() {
							pushDataLayerEvent('view', viewEventDetails);
						}, 350);
				}
    	}
    }
	}

	function isMinNumQuestionsAnswered() {
		return $quizWpr.find(".rbc-wp-quiz-question-wpr").not(".optional-question").find(".rbc-wp-quiz-question:checked:first").length >= $quizWpr.data("required-questions");
	}

	function isQuizBlank() {
		return $quizWpr.find(".rbc-wp-quiz-question:checked").length == 0;
	}

	function resetQuiz() {
		// Uncheck radio buttons and checkboxes
		$quizWpr.find(".rbc-wp-quiz-question:checked").each(function(i, el) {
			$(el).prop("checked", false).trigger("change.rbc-wp-quiz");
		});

		/*
		// Unselect selected options
		$(".rbc-wp-quiz-wpr").find(":selected").each(function() {
			$(this).prop("selected", false);
		});
		*/

		$(".rbc-wp-quiz-result.show").removeClass("show");
	}

	function validateAnswers() {
		var minNumQuestions = isMinNumQuestionsAnswered();

		return minNumQuestions;
	}
	
	function getBaseTitle(fullTitle) {
		return fullTitle.split(' - ')[0];
	}

	$(function() {

		$(".rbc-wp-quiz-results-btn").on("click.rbc-wp-quiz", function() {
			calculateQuizResults($quizWpr.data("quiz-type"));
			return false;
		});

		$(".rbc-wp-quiz-reset-btn").on("click.rbc-wp-quiz", function() {
			var postTitle = getBaseTitle(document.title) + ` - reset`;
			var dataDigId = $(this).data('reset-dig-id');
			pushDataLayerEvent('click', postTitle, dataDigId);
			resetQuiz();
			return false;
		});

		$quizWpr.find(".rbc-wp-quiz-question").on("change.rbc-wp-quiz", function() {
			$(".rbc-wp-quiz-results-btn").prop("disabled", !validateAnswers());
			$(".rbc-wp-quiz-reset-btn").prop("disabled", isQuizBlank());
		}).triggerHandler("change.rbc-wp-quiz");

	});

	//checking for PSI quiz template
	if ($('.psi-quiz-template').length) {

		var hiddenInput = document.querySelector('input[name="questionnaire_gallery"]');
		var galleryUrls = [];

		if (hiddenInput && hiddenInput.value) {
				try {
						galleryUrls = JSON.parse(hiddenInput.value);
				} catch (e) {
						console.error("Invalid JSON in hidden input for gallery URLs", e);
				}
		}
		
		var imageUrls = galleryUrls.length > 0 ? galleryUrls : [
			'https://www.rbcroyalbank.com/en-ca/wp-content/uploads/sites/12/2023/06/Quiz-1_800x1000.jpg',  
			'https://www.rbcroyalbank.com/en-ca/wp-content/uploads/sites/12/2023/06/Quiz-2_reupload.jpg',    
			'https://www.rbcroyalbank.com/en-ca/wp-content/uploads/sites/12/2023/06/Quiz-3_800x100_v2.jpg',    
			'https://www.rbcroyalbank.com/en-ca/wp-content/uploads/sites/12/2023/06/Quiz-4-800x1000-1.jpg',    
			'https://www.rbcroyalbank.com/en-ca/wp-content/uploads/sites/12/2023/06/Quiz-5-800x1000-1.jpg'
		];

		var preloadImages = function() {
			for (var i = 0; i < imageUrls.length; i++) {
					var img = new Image();
					img.src = imageUrls[i];
			}
	}

		// Call preloadImages function
		preloadImages();

		var lang = document.getElementsByTagName('html')[0].getAttribute('lang');

		if (lang.substring(0, 2) === 'fr') {
			$continue = 'Continuer';
			$started = 'Commencer';
			$reset = 'Recommencer';
			$drumroll = `<div class="centered text-center mar-b mob-mar-t mob-pad-lr-dbl">\
			<p class="h3">Roulement de tambour, s’il vous plaît</p>\
			<p>Voici les résultats de notre jeu-questionnaire :</p>\
			</div>`;
		} else {
			$continue = 'Continue';
			$started = 'Get Started';
			$reset = 'Start Over'
			$drumroll = `<div class="centered text-center mar-b mob-mar-t mob-pad-lr-dbl">\
			<p class="h3">Drum roll please ...</p>\
			<p>Here's what our quiz determined:</p>\
			</div>`;
		}

		$('.rbc-wp-quiz').addClass('pad-t-hlf');
		$('.rbc-wp-quiz').removeClass('grid-wpr');
	

		var resetDiv = $('#reset-container');
		var resetBtn = $('.rbc-wp-quiz-reset-btn');
		var btnDiv = $('.rbc-wp-quiz-btn-wpr');
		var resultsWpr = $('.rbc-wp-quiz-results-wpr');	
		
		// Check if progress bar already exists before appending
		if (!progressBarExists) {
			var $quizLength = $(".rbc-wp-quiz li.rbc-wp-quiz-question-wpr").length;
			var widthLength = 100 / $quizLength;

			var progressBar = `<div class="progress-bar">\
					<div class="bg-blue progress" style="height:4px;width:${Math.floor(widthLength * 1)}%">\
					<p class="prog-status fl-r mar-t text-script text-black">${Math.floor(widthLength * 1)}%</p>\
					</div>\
					</div>`;

			// Append the progress bar once
			$('.rbc-wp-quiz-wpr').prepend(progressBar);
			progressBarExists = true;  // Mark progress bar as created
		}
		
		$('ol.rbc-wp-quiz li.rbc-wp-quiz-question-wpr > label').each(function() {
			var content = $(this).text();
			var newHeading = $('<h4>', { 
					'class': 'rbc-wp-quiz-question-text'
			}).text(content);
	
			$(this).replaceWith(newHeading);
	});
	
		//on page load:
		$(".rbc-wp-quiz-wpr").hide();
		$('ol.rbc-wp-quiz >  div.hr').hide();
		$('.rbc-wp-quiz-question-suffix').remove();
		$('.rbc-wp-quiz-results-btn').hide();
		$('.rbc-wp-quiz-results-wpr').hide();
		$('.rbc-wp-quiz-results-wpr').addClass('bg-cool-white pad-lr-dbl pad-tb'); 
		$('.rbc-wp-quiz-result-heading').addClass('w-66 w-mob-100 font-500');
		// $('.nav-bar').addClass('desktop-only');
	
		$(btnDiv).hide();
		
		$("div > #quiz-content").append('<button class="fl-r btn primary" id="start-quiz">'+ $started +'</button>');
		
		//WP Content

		$('#start-quiz').click(function(){
			$(".rbc-wp-quiz-wpr").show();
			$('.psi-quiz-wpr').show();
			$(".rbc-wp-quiz-wpr").addClass('w-mob-100 pad-r mx-90');
			$("#quiz-content").hide();

            //Quick fix to changing images per question
            if ($('#question1').is(':visible')) {
				$('.split-left').css('background-image', "url('" + imageUrls[0] + "')");
				$('.split-left .wp-block-post-featured-image').hide();
			}
		})
		
		
		//Add a button for every question, last one different
		$('ol.rbc-wp-quiz li.rbc-wp-quiz-question-wpr').each(function(index) {
			// console.log(index);
			var $this = $(this);
			var button;

			if($this[0] === $('ol.rbc-wp-quiz li.rbc-wp-quiz-question-wpr').last()[0]) {
				button = $('<button>', {
					class: 'rbc-wp-quiz-results-btn btn fl-r disabled primary',
					id: 'quiz-result'
				}).text($continue);
			} else {
					button = $('<button>', {
					class: 'continue btn primary fl-r disabled',
					id: 'continue-quiz-' + index
				}).text($continue);
			}
			$this.append(button);
		});
		
		//Hide all questions but first
		$('ol.rbc-wp-quiz li.rbc-wp-quiz-question-wpr').each(function(){
			$(this).hide();
			$('#question1').show();
		});
		
		
		//Hide once continue is clicked, make next question appear
		$(function() {
			var currentQuestionIndex = 0;
			var totalQuestions = $('li.rbc-wp-quiz-question-wpr').length;
	
			// Only set the image when the quiz starts
			$('#start-quiz').click(function(){
					$(".rbc-wp-quiz-wpr").show();
					$('.psi-quiz-wpr').show();
					$(".rbc-wp-quiz-wpr").addClass('w-mob-100 pad-r mx-90');
					$("#quiz-content").hide();
					
					// Set the image for the first question
					$('.split-left').css('background-image', "url('" + imageUrls[0] + "')");
					$('.split-left .wp-block-post-featured-image').hide();
			});
	
			// When an input is selected, enable the continue button
			$(":input").change(function(){
					$(this).closest("li.rbc-wp-quiz-question-wpr").find("button.continue").removeClass('disabled');
					$(this).closest("li.rbc-wp-quiz-question-wpr").find("button.rbc-wp-quiz-results-btn").removeClass('disabled');
					
					$("button.continue").off('click').on('click', function() {
							// Hide the current question and show the next one
							$(this).parents("li.rbc-wp-quiz-question-wpr").hide();
							$(this).closest("li.rbc-wp-quiz-question-wpr").next().next().show();
	
							// Increment the question index
							currentQuestionIndex++;
	
							// Ensure the index doesn't go out of bounds
							if (currentQuestionIndex < totalQuestions && currentQuestionIndex < imageUrls.length) {
									// Update the background image for the current question
									$('.split-left').css('background-image', "url('" + imageUrls[currentQuestionIndex] + "')");
							} else {
									console.warn("No image available for question index " + currentQuestionIndex);
							}
	
							// Update the progress bar
							var progLength = widthLength * (currentQuestionIndex + 1);
							$('.progress').css('width', `${progLength}%`);
							$('.prog-status').text(`${Math.floor(progLength)}%`);
					});
			});
		});
		
		//Reset
		$(resetBtn).addClass('redo-link mar-l-hlf font-400 mob-pad-l');
		$(resetBtn).text($reset);
		$(resetBtn).appendTo(resetDiv);
		$(resetDiv).hide();
		
		$(resetBtn).click(function(){
			
			$('.psi-quiz-template').hide();
			// $("body").load(location.href + " body");
		
			setTimeout(
				function(){
					location.reload();
				}, 100);
		});	
		
		//Last Result
		$('.rbc-wp-quiz-results-btn').click(function(){
			$('.rbc-wp-quiz').hide();
			$('.split-left').hide();
			$('.result-container').show();
			$('.rbc-wp-quiz-results-wpr').show();
		
			// $('.split-wpr').hide();
			$(resetDiv).show();
			$(btnDiv).show();
			$('.rbc-wp-quiz-results-wpr').prependTo('div.result-container');
			$('.rbc-wp-quiz-results-wpr').css({
				'display' : 'flex',
				'justify-content' : 'center'});
			$('.progress-bar').remove();
			$('.psi-quiz-wpr>[class*=col-]').remove();
			$('div.psi-quiz-wpr').append($drumroll);

		
			if (resultsWpr.length > 1) {
				resultsWpr.not(':last').remove()
			}
		
			$('.rbc-wp-quiz-result').each(function(){
				$(this).addClass('section-inner w-75 mar-0-auto w-mob-100 pad-b-0');
			})
		});
		
		var progIndex = 2;
		$('button.continue').click(function () {
		
			var progLength = progIndex++ * widthLength;
		
			// console.log(progLength); 
			
				$('.progress').css('width', `${progLength}%`);
				$('.prog-status').text(`${Math.floor(progLength * 1)}%`);
			
		});
		
		$('.rbc-wp-quiz-results-wpr div.section-inner').remove();
		
	
	}

})(jQuery, window, document);;
