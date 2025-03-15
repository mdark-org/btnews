
if [ -z "$bvid" ]; then
    if [ -z "$category" ]; then
        weekday=$(date +%w)
        case $weekday in
            0|2|5) 
                keyword="睡前消息"
                mid="316568752" ;;
            1|4)
                keyword="高见"
                mid="59104725" ;;
            3|6)
                keyword="讲点黑话"
                mid="64219557" ;;
        esac
        echo "mid=$mid" >> "$GITHUB_OUTPUT"
        echo "keyword=$keyword" >> "$GITHUB_OUTPUT"
    fi
fi