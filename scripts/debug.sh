if [ $# -eq 0 ]; then
    mode="development"
else 
    mode="$1"
fi

echo "Running node application in $mode mode"

NODE_ENV=$mode node --inspect bot.js
printf "\nYou can now visit chrome://inspect in a chromium-based browser to attach devtools to the application"