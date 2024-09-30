import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Easing,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const App = () => {
  const [toggle, setToggle] = useState(false);
  const animatedSize = useRef(new Animated.Value(0)).current;
  const segment_number = 15;
  const delay = 1500;

  // ==============controlling the toggle ============
  useEffect(() => {
    const listener = animatedSize.addListener(({value}) => {
      if (value > 0) {
        setToggle(true);
      } else {
        setToggle(false);
      }
    });

    return () => {
      animatedSize.removeListener(listener);
    };
  }, [animatedSize]);

  const increaseSize = () => {
    console.log('clicked');
    const animation = Animated.sequence([
      Animated.spring(animatedSize, {
        toValue: 1,
        tension: 1,
        friction: 25,
        useNativeDriver: false,
      }),
    ]);

    animation.start(() => {
      Animated.timing(animatedSize, {
        toValue: 1,
        duration: delay,
        useNativeDriver: false,
      }).start();
    });
  };

  const decreaseSize = () => {
    console.log('clicked');
    Animated.spring(animatedSize, {
      toValue: 0,
      friction: 20,
      useNativeDriver: false,
    }).start(() => {
      Animated.timing(animatedSize, {
        toValue: 0,
        duration: delay,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    });
  };

  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log(index);
      if (isOpen && toggle && index < segment_number - 1) {
        setIndex(prev => prev + 1);
      } else if (!isOpen && toggle && index > 0) {
        setIndex(prev => prev - 1);
      } else {
        clearInterval(interval); // Stop interval when index reaches 11 or 0
      }
    }, delay / (segment_number * 2));

    return () => clearInterval(interval);
  }, [toggle, index, isOpen]);

  // Interpolate the animated value (0 to 1) to control width and height
  const outerRadius = animatedSize.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 280],
  });

  const Segment = ({setColor, i, setToggle, length}: any) => {
    const selectedColor = (color: string) => {
      console.log(color);
      setIsOpen(false);
      decreaseSize();
      setColor({lightcolor: lightenColor(color, 30), darkcolor: color});
    };

    return (
      <View
        style={{
          height: '100%',
          width: '100%',
          position: 'absolute',
          transform: [{rotate: `${i * (360 / length)}deg`}],
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Pressable
          onPress={() => {
            selectedColor(getColorForSegment(i));
          }}
          style={{alignItems: 'center', justifyContent: 'center'}}>
          <Animated.View
            style={{
              transform: [
                {
                  scale: animatedSize.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                  }),
                },
                {
                  translateY: animatedSize.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-150, 0],
                  }),
                },
              ],
              height: 130,
              width: 80,
              borderRadius: 40,
              backgroundColor: getColorForSegment(i),
              position: 'absolute',
              top: 0,
              shadowOffset: {
                height: 5,
                width: 20,
              },
              shadowOpacity: 100,
              shadowColor: 'black',
              shadowRadius: 5,
              elevation: 15,
              opacity: i <= index ? 1 : 0,
            }}></Animated.View>
        </Pressable>
      </View>
    );
  };

  const getColorForSegment = (index: number) => {
    // Define colors or use a color array as per your requirement
    const colors = [
      '#4eb74e',
      '#34aadc',
      '#f0ad4e',
      '#d9534f',
      '#5bc0de',
      '#9b59b6',
      '#2ecc71',
      '#3498db',
      '#f39c12',
      '#e74c3c',
      '#D3D3D3',
      '#AEC6CF',
      '#FDFD96',
      '#FF5733',
      '#808000',
      '#D2691E',
      '#CD853F',
      '#FF00FF',
      '#FA8072',
    ];
    return colors[index % colors.length];
  };

  const [color, setColor] = useState({
    lightcolor: lightenColor('#4eb74e', 30),
    darkcolor: '#4eb74e',
  });

  function lightenColor(hexColor: string, percentage: number) {
    // Remove the hash at the start if it's there
    hexColor = hexColor.replace(/^#/, '');

    // Parse the r, g, b values
    let r = parseInt(hexColor.substring(0, 2), 16);
    let g = parseInt(hexColor.substring(2, 4), 16);
    let b = parseInt(hexColor.substring(4, 6), 16);

    // Increase each component by the given percentage
    r = Math.min(255, Math.floor(r + (255 - r) * (percentage / 100)));
    g = Math.min(255, Math.floor(g + (255 - g) * (percentage / 100)));
    b = Math.min(255, Math.floor(b + (255 - b) * (percentage / 100)));

    // Convert RGB back to hex
    const toHex = (value: any) => {
      const hex = value.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <LinearGradient
        colors={[color.lightcolor, color.darkcolor]}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableWithoutFeedback
          onPress={() => {
            increaseSize();
            setIsOpen(true);
          }}>
          <Animated.View
            style={{
              height: outerRadius,
              width: outerRadius,
              borderRadius: animatedSize.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 140],
              }),
              backgroundColor: 'white',
              position: 'relative',
              alignItems: 'center',
              justifyContent: 'center',
              shadowOffset: {
                width: 5,
                height: 10,
              },
              shadowColor: 'black',
              shadowOpacity: 100,
              shadowRadius: 5,
              elevation: 10,
              padding: 10,
            }}>
            {!toggle && (
              <View
                style={{
                  height: 80,
                  width: 80,
                  borderRadius: 40,
                  backgroundColor: color.darkcolor,
                  zIndex: 20,
                }}
              />
            )}

            {toggle && (
              <View
                style={{
                  width: 10,
                  height: 10,
                  position: 'relative',
                  backgroundColor: 'black',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {Array.from({length: segment_number}).map((_, i) => (
                  <Segment
                    key={i}
                    i={i}
                    setColor={setColor}
                    setToggle={setToggle}
                    length={segment_number}
                  />
                ))}
              </View>
            )}
          </Animated.View>
        </TouchableWithoutFeedback>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  segment: {
    position: 'absolute',
    borderTopWidth: 10, // Adjust as per your strokeWidth
    borderRightWidth: 10, // Adjust as per your strokeWidth
    borderBottomWidth: 10, // Adjust as per your strokeWidth
    transform: [{rotate: '0deg'}],
    borderLeftWidth: 10, // Adjust as per your strokeWidth
    borderTopLeftRadius: 100, // Adjust as per your size
    borderTopRightRadius: 100, // Adjust as per your size
    borderBottomRightRadius: 100, // Adjust as per your size
    borderBottomLeftRadius: 100, // Adjust as per your size
  },
});

export default App;
