# Co-creation navigator
The co-creation navigator guides you through the different stages of co-creation, from preparation to execution, and directs you to tools and methods that help you in each stage. You will learn how to build your project foundation, how to get in the right frame of mind and how to remain innovative throughout the co-creation process. 

The co-creation navigator uses the metaphor of a subway map to guide you on your journey through the different stations of a co-creative process.

This is the first iteration of the co-creation navigator, made available in the Cities-4-People project. As our own co-creation process moves forward, we will incorporate feedback based on user needs in order to develop the application further.

## Deploy
Uses Drupal as CMS with a decoupled React front-end

### All
ansible-playbook playbook.yml -i hosts --ask-sudo-pass

### Only React
ansible-playbook react.yml -i hosts --ask-sudo-pass
