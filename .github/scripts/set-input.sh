function setInputByCategory() {
        case $1 in
            "btnews") 
                keyword="睡前消息"
                mid="316568752" ;;
            "opinion")
                keyword="高见"
                mid="59104725" ;;
            "commercial")
                keyword="讲点黑话"
                mid="64219557" ;;
        esac
        echo "mid=$mid" >> "$GITHUB_OUTPUT"
        echo "keyword=$keyword" >> "$GITHUB_OUTPUT"    
}

if [ -z "$bvid" ]; then
    if [ -z "$category" ]; then
        weekday=$(date +%w)
        case $weekday in
            0|2|5) category='btnews' ;;
            1|4) category='opinion' ;;
            3|6) category='commercial' ;;
        esac
    fi
    setInputByCategory "$category"
fi