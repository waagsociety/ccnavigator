# Co-creation navigator
Co-creation navigator is your guide in the world of co-creation. Uses Drupal as CMS with a decoupled React front-end


## Deploy

### All
ansible-playbook react.yml -i hosts --ask-sudo-pass

### Only React
ansible-playbook playbook.yml -i hosts --ask-sudo-pass