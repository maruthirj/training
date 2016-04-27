//Each of the controllers should be moved to separate files for easy readability 
//In the end they will be assembled as a single js file using requireJS and grunt build system
(function($) {
	//Setup dependencies for the module
	var app = angular.module('mysocial', [ 'ngRoute','textAngular','ngWebsocket' ]);
	app.run(function($http,$rootScope,$location,$log,$websocket) {
		$log.debug("App run...");
		$rootScope.currentPath = $location.path()
	});

	//ROUTE configurations for all views
	app.config([ '$routeProvider', function($routeProvider) {
		$routeProvider.when('/', {
			templateUrl : 'templates/appHome.html',
			controller : 'AppHomeController'
		}).when('/login', {
			templateUrl : 'templates/login.html',
			controller : 'LoginController'
		}).when('/register', {
			templateUrl : 'templates/register.html',
			controller : 'LoginController'
		}).when('/newPost', {
			templateUrl : 'templates/BlogEdit.html',
			controller : 'BlogController'
		}).otherwise({
			templateUrl : '/404.html'
		});
	} ]).factory('authHttpResponseInterceptor',
			[ '$q', '$location','$log', function($q, $location, $log) {
				return {
					response : function(response) {
						if (response.status === 401) {
							$log.debug("Response 401");
						}
						return response || $q.when(response);
					},
					responseError : function(rejection) {
						if (rejection.status === 401) {
							$log.debug("Response Error 401", rejection);
							$location.path('/login');
						}
						return $q.reject(rejection);
					}
				}
			} ]).config([ '$httpProvider', function($httpProvider) {
		// Http Intercpetor to check auth failures for xhr requests
		$httpProvider.interceptors.push('authHttpResponseInterceptor');
	} ]);

	//------------------------------------------------------------------------------------------------------------------
	// Controller for the home page with blogs and live users
	//------------------------------------------------------------------------------------------------------------------
	app.controller('AppHomeController', function($http, $log, $scope,
			$rootScope, $websocket, $location) {
		var controller = this;
		$log.debug("AppHomeController...");
		$http.get('/Services/rest/blogs').success(
				function(data, status, headers, config) {
					$scope.blogs = data;
					$scope.loading = false;
				}).error(function(data, status, headers, config) {
					$scope.loading = false;
					$scope.error = status;
				});
		var ws=null;
		$http.get('/Services/rest/user?signedIn=true').success(
				function(data, status, headers, config) {
					$scope.connectedUsers = data;
					$scope.loading = false;
					//Setup a websocket connection to server using current host
					ws = $websocket.$new('ws://'+$location.host()+':'+$location.port()+'/Services/chat', ['binary', 'base64']); // instance of ngWebsocket, handled by $websocket service
					$log.debug("Web socket established...");
			        ws.$on('$open', function () {
			            $log.debug('Socket is open');
			        });
			        
			        ws.$on('$message', function(data){
			        	 $log.debug('The websocket server has sent the following data:');
			        	 $log.debug(data);
			        	 $log.debug(data.messageType);
			        	 if(data.messageType==="UserLogin"){
			        		 //Add this user to list of users
			        		 var found = false;
			        		 for(var index in $scope.connectedUsers){
			        			 if($scope.connectedUsers[index].id==data.messageObject.id){
			        				 found=true;
			        			 }
			        		 }
			        		 if(!found){
			        			 $log.debug("Adding user to list: "+data.messageObject.first);
			        			 $scope.connectedUsers.push(data.messageObject);
			        			 $scope.$digest();
			        		 }
			        	 }else if(data.messageType==="chatMessage"){
			        		 //Make sure chat window opensup
			        		 $scope.showChat=true
			        		 $log.debug("Updating chat message: ");
			        		 $log.debug(data.messageObject);
			        		 if($scope.chatMessages===undefined)
			        			 $scope.chatMessages=[];
			        		 $scope.chatMessages.push(data.messageObject);
			        		 $log.debug("Chat Messages: ");
			        		 $log.debug($scope.chatMessages);
			        		 $scope.$digest();
			        	 }
			        });
			        ws.$on('$close', function () {
			            console.log('Web socket closed');
			            ws.$close();
			        });
				}).error(function(data, status, headers, config) {
					$scope.loading = false;
					$scope.error = status;
				});
			$scope.tagSearch = function(){
				$http.get('/Services/rest/blogs?tag='+$scope.searchTag).success(
					function(data, status, headers, config) {
						$scope.blogs = data;
						$scope.loading = false;
					}).error(function(data, status, headers, config) {
						$scope.loading = false;
						$scope.error = status;
					});
			};
			$scope.submitComment = function(comment, blogId){
				$log.debug(comment);
				//var blogId = comment.blogId;
				$http.post('/Services/rest/blogs/'+blogId+'/comments',comment).success(
					function(data, status, headers, config) {
						$scope.loading = false;
						for(var index in $scope.blogs){
							if($scope.blogs[index].id==blogId){
								$log.debug("Pushing the added comment to list");
								$scope.blogs[index].comments.push(comment);
								break;
							}
						}
					}).error(function(data, status, headers, config) {
						$scope.loading = false;
						$scope.error = status;
					});
			};
		
			$scope.sendMessage = function(chatMessage){
				$log.debug("Sending "+chatMessage);
				ws.$emit('chatMessage', chatMessage); // send a message to the websocket server
				$scope.chatMessage="";
			}
	});
	//------------------------------------------------------------------------------------------------------------------
	// Controller for the login view and the registration screen
	//------------------------------------------------------------------------------------------------------------------
	app.controller('LoginController', function($http, $log, $scope, $location,
			$rootScope) {
		var controller = this;
		$scope.isLoadingCompanies = true;
		$http.get('/Services/rest/company').success(
				function(data, status, headers, config) {
					$scope.companies = data;
					$scope.isLoadingCompanies = false;
				}).error(function(data, status, headers, config) {
					$scope.isLoadingCompanies = false;
					$scope.error = status;
				});
		$scope.login = function(user) {
			$log.debug("Logging in user...");
			$http.post("/Services/rest/user/auth", user).success(
					function() {
						$rootScope.loggedIn = true;
						$location.path("/");
					});
		};
		$scope.register = function() {
			$log.debug("Navigating to register...");
			$location.path("/register");
		};
		$scope.submitRegister = function(user){
			$log.debug("Registering...");
			$http.post("/Services/rest/user/register", user).success(
					function(data) {
						$log.debug(data);
						$location.path("/");
					});
		}
		$scope.companyChange = function(companyId) {
			$log.debug("Loading sites for company: " + companyId);
			// Load sites
			$http.get('/Services/rest/company/'+companyId+'/sites').success(
					function(data, status, headers, config) {
						$scope.sites = data;
						$scope.isLoadingSites = false;
					}).error(function(data, status, headers, config) {
						$scope.isLoadingSites = false;
						$scope.error = status;
					});
		};
		
		$scope.siteChange = function(companyId, siteId) {
			$log.debug("Loading departments: " + companyId);
			// Load sites
			$http.get('/Services/rest/company/'+companyId+'/sites/'+siteId+'/departments').success(
					function(data, status, headers, config) {
						$scope.departments = data;
						$scope.isLoadingDepts = false;
					}).error(function(data, status, headers, config) {
						$scope.isLoadingDepts = false;
						$scope.error = status;
					});
		};
	});
	//------------------------------------------------------------------------------------------------------------------
	// Controller for the navigation bar.. currently has no functions
	//------------------------------------------------------------------------------------------------------------------
	app.controller('NavbarController',
			function($http, $log, $scope, $rootScope) {
				var controller = this;
				$log.debug("Navbar controller...");

	});

	//------------------------------------------------------------------------------------------------------------------
	// Controller for new blog post view
	//------------------------------------------------------------------------------------------------------------------
	app.controller('BlogController',function($http, $log, $scope, $location) {
				var controller = this;
				$log.debug("Blog controller...");
				$scope.blog={};
				$scope.blog.content = 'Blog text here...';
				$scope.saveBlog = function(blog){
					$http.post("/Services/rest/blogs", blog).success(
							function() {
								$log.debug("Saved blog...");
								$location.path("/");
							});
				};
				$scope.cancel = function(blog){
					$location.path("/");
				};
	});

})($);//Passing jquery object just in case 
