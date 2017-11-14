/* global XMLHttpRequest */

window.cdMenu = function (options) {
  if (!options) {
    options = {};
  }

  var zenBase = options.zenBase || 'https://zen.coderdojo.com';
  zenBase = zenBase.replace(/\/$/, ''); // remove trailing slash

  var toggle = document.querySelector('.cd-menu__hamburger');
  var slidingMenu = document.querySelector('#cd-menu__sliding-menu-primary');
  var scrim = document.querySelector('.cd-menu__scrim');
  var secondarySlidingMenus = document.querySelectorAll('.cd-menu__sliding-menu-secondary');
  var closeButtons = document.querySelectorAll('.cd-menu__close-button');
  var menuExpansions = document.querySelectorAll('.cd-menu__sliding-menu .cd-menu__content > ul > li > span');
  var profileDropdown = document.querySelector('.cd-menu__desktop-nav .cd-menu__profile');
  var dropdowns = document.querySelectorAll('.cd-menu__dropdown');
  var cdfAdminMenuLinks = document.querySelectorAll('.cd-menu__cdf-admin-link');
  var loginRegisters = document.querySelectorAll('.cd-menu__account');
  var profiles = document.querySelectorAll('.cd-menu__profile');
  var profileNames = document.querySelectorAll('.cd-menu__profile-name');
  var profileLinks = document.querySelectorAll('.cd-menu__profile-link');
  var profilePics = document.querySelectorAll('.cd-menu__profile-pic');
  var refererLinks = document.querySelectorAll('.cd-menu__referer-link');
  var eLearningLinks = document.querySelectorAll('.cd-menu__e-learning-link');
  var parentLinks = document.querySelectorAll('.cd-menu__parent-link');

  function request (url, postData, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        try {
          var responseJson = JSON.parse(this.responseText);
          success(responseJson);
        } catch (e) {
          error(e);
        }
      } else if (this.readyState === 4) {
        error(this);
      }
    };
    xhr.open(postData ? 'POST' : 'GET', url, true);
    xhr.withCredentials = true;
    if (postData) {
      xhr.setRequestHeader('Content-type', 'application/json');
    }
    xhr.send(postData);
  }

  function each (it, cb) {
    return Array.prototype.forEach.call(it, cb);
  }

  function showElement (el) {
    el.style.display = 'block';
    // TODO fix mobile nav to use classes so this isnt needed
    el.setAttribute('style', 'display: block !important;');
  }

  function hideElement (el) {
    el.style.display = 'block';
    // TODO fix mobile nav to use classes so this isnt needed
    el.setAttribute('style', 'display: none !important;');
  }

  function showLoginRegister () {
    each(loginRegisters, showElement);
  }

  function hideLoginRegister () {
    each(loginRegisters, hideElement);
  }

  function closeDrawer () {
    slidingMenu.setAttribute('data-toggle', 'closed');
    scrim.className = 'cd-menu__scrim';
    each(secondarySlidingMenus, function (secondarySlidingMenu) {
      secondarySlidingMenu.setAttribute('data-toggle', 'closed');
    });
  }

  function openDrawer () {
    slidingMenu.setAttribute('data-toggle', 'open');
    scrim.className = 'cd-menu__scrim cd-menu__scrim--visible';
  }

  function closeDropdowns (e) {
    if (e.target !== profileDropdown && e.target.parentElement !== profileDropdown) {
      profileDropdown.setAttribute('data-toggle', 'closed');
    }
    each(dropdowns, function (dropdown) {
      if (e.target !== dropdown && e.target.parentElement !== dropdown &&
        e.target.parentElement.parentElement !== dropdown) {
        dropdown.setAttribute('data-toggle', 'closed');
      }
    });
  }

  function toggleDropdown () {
    if (this.getAttribute('data-toggle') === 'open') {
      this.setAttribute('data-toggle', 'closed');
    } else {
      this.setAttribute('data-toggle', 'open');
    }
  }

  function canSeeELearningModule (userDojos) {
    var userTypeIndex = 0;
    var userDojosIndex = 0;
    var isAllowed = false;
    var allowedUserTypes = ['mentor', 'champion', 'parent-guardian'];
    while (!isAllowed && userDojosIndex < userDojos.length) {
      var userDojo = userDojos[userDojosIndex];
      while (!isAllowed && userTypeIndex < userDojo.userTypes.length) {
        var userType = userDojo.userTypes[userTypeIndex];
        if (allowedUserTypes.indexOf(userType) > -1) {
          isAllowed = true;
        }
        userTypeIndex += 1;
      }
      userDojosIndex += 1;
    }
    return isAllowed;
  }

  function initSlidingMenu () {
    toggle.addEventListener('click', function () {
      if (slidingMenu.getAttribute('data-toggle') === 'open') {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    scrim.addEventListener('click', closeDrawer);

    each(closeButtons, function (closeButton) {
      closeButton.addEventListener('click', closeDrawer);
    });

    each(menuExpansions, function (menuExpansion) {
      var slidingMenuSecondary = menuExpansion.parentElement.querySelector('.cd-menu__sliding-menu-secondary');
      var backButton = slidingMenuSecondary.querySelector('.cd-menu__back-button');
      if (backButton) {
        backButton.addEventListener('click', function () {
          slidingMenuSecondary.setAttribute('data-toggle', 'closed');
        });
      }
      if (menuExpansion) {
        menuExpansion.addEventListener('click', function () {
          slidingMenuSecondary.setAttribute('data-toggle', 'open');
        });
      }
    });
  }

  function initMenuDropdowns () {
    each(dropdowns, function (dropdown) {
      dropdown.addEventListener('click', toggleDropdown);
    });

    profileDropdown.addEventListener('click', toggleDropdown);

    document.getElementsByTagName('body')[0].addEventListener('click', closeDropdowns);

    document.getElementsByTagName('body')[0].addEventListener('touchstart', closeDropdowns);
  }

  function initProfileMenu () {
    profileDropdown.addEventListener('click', toggleDropdown);
    each(refererLinks, function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = this.href + '?referer=' + encodeURIComponent(window.location);
      });
    });
  }

  function loadProfileMenu () {
    request(zenBase + '/api/2.0/users/instance', null, function (userData) {
      if (userData && userData.user) {
        each(profileNames, function (profileName) {
          profileName.innerText = userData.user.name;
        });
        each(profileLinks, function (profileLink) {
          profileLink.href = zenBase + '/dashboard/profile/' + userData.user.id + '/edit';
        });
        each(profilePics, function (profilePic) {
          profilePic.style.backgroundImage = 'url(' + zenBase + '/api/2.0/profiles/' + userData.user.profileId + '/avatar_img)';
        });
        if (userData.user.initUserType.indexOf('attendee') === -1) {
          each(parentLinks, showElement);
        }
        if (userData.user.roles.indexOf('cdf-admin') !== -1) {
          each(cdfAdminMenuLinks, showElement);
        }
        each(profiles, function (profile) {
          profile.style.display = 'flex';
        });
        hideLoginRegister();
        request(zenBase + '/api/2.0/dojos/users', '{"query": {"userId":"' + userData.user.id + '"}}', function (userDojos) {
          var initUserType = JSON.parse(userData.user.initUserType);
          userDojos.push({userTypes: [initUserType.name]});
          if (userDojos && userDojos.length > 0) {
            var isAllowed = canSeeELearningModule(userDojos);
            if (isAllowed) {
              each(eLearningLinks, showElement);
            }
          }
        });
      } else {
        showLoginRegister();
      }
    }, showLoginRegister);
  }

  window.cdMenu.fns = {
    loadProfileMenu: loadProfileMenu
  };

  window.addEventListener('load', function () {
    initSlidingMenu();
    initMenuDropdowns();
    initProfileMenu();
    loadProfileMenu();
  });
};
