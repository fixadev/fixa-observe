   #!/bin/bash

   if [ -z "$FLY_APP_NAME" ]; then
     echo "FLY_APP_NAME is not set"
     exit 1
   fi

   sed "s/APP_NAME_PLACEHOLDER/$FLY_APP_NAME/" fly.template.toml > fly.toml