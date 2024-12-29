function Card({
  info,
  index,
  totalLength,
  activeIndex,
}: {
  totalLength: number;
  index: number;
  info: (typeof data)[0];
  activeIndex: SharedValue<number>;
}) {
  const stylez = useAnimatedStyle(() => {
    return {
      position: "absolute",
      zIndex: totalLength - index,
      opacity: interpolate(
        activeIndex.value,
        [index - 1, index, index + 1],
        [1 - 1 / maxVisibleItems, 1, 1]
      ),
      shadowOpacity: interpolate(
        activeIndex.value,
        [index - 1, index, index + 1],
        [0, 0, 1],
        { extrapolateRight: Extrapolation.CLAMP }
      ),
      transform: [
        {
          translateY: interpolate(
            activeIndex.value,
            [index - 1, index, index + 1],
            [
              -layout.cardsGap,
              0,
              // layout.height - layout.cardsGap
              1000, // make exact dimensions
            ],
            { extrapolateRight: Extrapolation.EXTEND }
          ),
        },
        {
          scale: interpolate(
            activeIndex.value,
            [index - 1, index, index + 1],
            [0.96, 1, 0.96]
          ),
        },
      ],
    };
  });

  let mode = "custom";

  if (mode === "default") {
    return (
      <Animated.View style={[styles.card, stylez]}>
        <Text
          style={[
            styles.title,
            {
              position: "absolute",
              top: -layout.spacing,
              right: layout.spacing,
              fontSize: 102,
              color: colors.primary,
              opacity: 0.05,
            },
          ]}
        >
          {index}
        </Text>
        <View style={styles.cardContent}>
          <Text style={styles.title}>{info.type}</Text>
          <View style={styles.row}>
            <Entypo name="clock" size={16} style={styles.icon} />
            <Text style={styles.subtitle}>
              {info.from} - {info.to}
            </Text>
          </View>
          <View style={styles.row}>
            <Entypo name="location" size={16} style={styles.icon} />
            <Text style={styles.subtitle}>{info.distance} km</Text>
          </View>
          <View style={styles.row}>
            <Entypo name="suitcase" size={16} style={styles.icon} />
            <Text style={styles.subtitle}>{info.role}</Text>
          </View>
        </View>
        <Image source={{ uri: locationImage }} style={styles.locationImage} />
      </Animated.View>
    );
  }

  const [value, setValue] = useState();
  // const handleChangeValue = (arg) => {
  //   console.log(`val: ${JSON.stringify(arg, null, 2)}`);
  //   console.log(typeof arg);

  //   let res = Math.round(arg);
  //   setValue(res);
  // };
  const handlePressButton = (arg: string) => {
    setSelection(arg);
    setCurrentStep(2);
  };
  const [frameAdvantageAnswer, setFrameAdvantageAnswer] = useState<
    number | undefined
  >();

  const handleSelectFrameAdvantage = (selection: number) => {
    setFrameAdvantageAnswer(selection);
  };
  const [selection, setSelection] = useState<string | undefined>();
  const [currentStep, setCurrentStep] = useState(1);

  if (mode === "custom") {
    return (
      <Animated.View style={[styles.card, stylez]}>
        <Image
          source={FRAME_DATA[index].image}
          style={{
            overflow: "hidden",
            // flex: 1,
            // borderRadius: layout.borderRadius - layout.spacing / 2,
            resizeMode: "contain",
            width: "90%", // Scales the image width proportionally
            height: "70%", // Scales the image height proportionally
          }}
        />
        {/* <Text>{JSON.stringify(FRAME_DATA[0])}</Text> */}

        <View
          style={{
            flexDirection: "row",
            gap: 30,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 30,
          }}
        >
          {currentStep === 1 ? (
            <>
              <IconButton
                icon={"minus"}
                onPress={() => handlePressButton("minus")}
                iconColor="white"
                containerColor="#383A6B"
                size={64}
              />
              <IconButton
                icon={"home"}
                onPress={() => handlePressButton("zero")}
                // iconColor="white"
                // containerColor="green"
                size={64}
              />
              <IconButton
                icon={"plus"}
                onPress={() => handlePressButton("plus")}
                iconColor="white"
                containerColor="#2E151D"
                size={64}
              />
            </>
          ) : (
            <View style={{ flexWrap: "wrap", flexDirection: "row", gap: 7 }}>
              {Array.from({ length: 10 }).map((item, index) => (
                <Button
                  key={index}
                  mode="contained"
                  onPress={() => handleSelectFrameAdvantage(index)}
                  // iconColor="white"
                  // containerColor="red"
                  // size={64}
                  children={index + 1}
                />
              ))}
            </View>
          )}
        </View>
        {/* <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 20 }}>{value}</Text>
            <HorizontalPicker
              minimumValue={-10}
              maximumValue={10}
              focusValue={0}
              onChangeValue={handleChangeValue}
            />
          </View> */}
      </Animated.View>
    );
  }
}
