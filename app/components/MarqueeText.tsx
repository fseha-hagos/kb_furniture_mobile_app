import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text } from 'react-native';

const { width } = Dimensions.get('window');

interface MarqueeTextProps {
  text: string;
  speed?: number;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
  height?: number | Animated.Value;
}

const MarqueeText: React.FC<MarqueeTextProps> = ({
  text,
  speed = 50,
  backgroundColor = '#00685C',
  textColor = 'white',
  fontSize = 14,
  height = 40,
}) => {
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let animationRef: Animated.CompositeAnimation;
    
    const startAnimation = () => {
      scrollX.setValue(0);
      animationRef = Animated.timing(scrollX, {
        toValue: -width,
        duration: (width / speed) * 1000,
        useNativeDriver: true,
      });
      
      animationRef.start(() => {
        // Restart animation when it completes
        setTimeout(startAnimation, 1000);
      });
    };

    startAnimation();

    // Cleanup function to stop animation when component unmounts
    return () => {
      if (animationRef) {
        animationRef.stop();
      }
    };
  }, [text, speed]);

  return (
    <Animated.View style={[styles.container, { backgroundColor, height }]}>
      <LinearGradient
        colors={[backgroundColor, backgroundColor]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Animated.View
          style={[
            styles.textContainer,
            {
              transform: [{ translateX: scrollX }],
            },
          ]}
        >
          <Text style={[styles.text, { color: textColor, fontSize }]}>
            {text}
          </Text>
          {/* Duplicate text for seamless loop */}
          <Text style={[styles.text, { color: textColor, fontSize, marginLeft: 50 }]}>
            {text}
          </Text>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    justifyContent: 'center',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontWeight: '500',
  },
});

export default MarqueeText; 