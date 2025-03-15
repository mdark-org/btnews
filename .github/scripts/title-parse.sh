#!/bin/bash

function format_range() {
  local index=$1
  formatted_index=$(printf "%04d" "$1")
  local range_start=$((((index / 100) * 100) + 1))
  local range_end=$((range_start + 99))
  formatted_range=$(printf "%04d_%04d" "$range_start" "$range_end")
}

REGEX="^【([^0-9]+)\s?([0-9]+)期?】.+$"
cat $1 | jq -r '.title' | while read -r title; do
    if [[ $title =~ $REGEX ]];
        then
        category="${BASH_REMATCH[1]}"
        index="${BASH_REMATCH[2]}"
        # 映射 category
        case "$category" in
          "讲点黑话") mapped_category="commercial";;
          "睡前消息") mapped_category="btnews";;
          "高见") mapped_category="opinion";;
          *) mapped_category="unknown"
            ;;
        esac

        formatted_index=$(printf "%04d" "$index")
        format_range "$index"
        path="docs/btnews/${mapped_category}/${formatted_range}"
        filepath="docs/btnews/${mapped_category}/${formatted_range}/${mapped_category}_${formatted_index}.md"
        echo "path: $filepath"
        if [ ! -f $filepath ]; then
          echo "exist=true" >> "$GITHUB_OUTPUT"
        fi
        echo "category=$mapped_category"
        echo "index=$formatted_index"
        echo "path=$path"
        echo "filepath=$filepath"
        echo "category=$mapped_category" >> "$GITHUB_OUTPUT"
        echo "index=$formatted_index" >> "$GITHUB_OUTPUT"
        echo "path=$path" >> "$GITHUB_OUTPUT"
        echo "filepath=$filepath" >> "$GITHUB_OUTPUT"
    else
        echo "Title format not matched: $title"
        exit 1
    fi
done
