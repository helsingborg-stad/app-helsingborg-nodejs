TYPINGS_PATH="./src/types/typings.ts"
PATH_OUTPUT="./json-schemas"

#array with "interface name"
TYPES=(
    "IBeacon"
    "IContentObject"
    "IGuideGroup"
    "IGuide"
    "INavigationItem"
    "INavigationCategory"
    "ILink"
    "ILocation"
    "IMediaContent"
    "IPointProperty"
    "IPosition"
)

for i in "${TYPES[@]}"
do
    echo "Generating schema for" $i...
    typescript-json-schema --required --strictNullChecks $TYPINGS_PATH $i --out $PATH_OUTPUT/$i.json
done

#typescript-json-schema --required --strictNullChecks $TYPINGS_PATH IGuide --out $PATH_OUTPUT/guide.json