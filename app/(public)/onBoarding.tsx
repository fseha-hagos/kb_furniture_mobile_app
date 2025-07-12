//import liraries
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';


// create a component
const onBoarding = () => {
    return (
       
        <View style={styles.container}>
                  
            <View style={styles.textContainer}>

                <Text style={{fontSize:40, textAlign: 'center', padding: 20, fontWeight:'600' }}>Bright furniture into your life</Text>
<Text style={{fontSize:16, fontWeight:'400' }}>Best furniture for best living experience</Text>
<Text style={{fontSize:16, fontWeight:'400' }}>Let's find it now</Text>
</View>
  


 <View style={styles.mainContent} >

            <ImageBackground style={{justifyContent: "center",
        alignItems:"center", flex: 1, width: "100%", height:"100%"}} source={require('@/assets/images/Designer(1).jpeg')} resizeMode='cover' >
            <View style={ styles.titleContainer}>
            <Text style={ styles.title} >Best Furniture </Text>
            <Text style={ styles.title} >For </Text>
            <Text style={ styles.title} >Best Living Experience</Text>
            </View>
           
              <View style={styles.buttonContainer}>
              <Ionicons name="chevron-forward-circle-outline" size={24} color="black" />
              </View>
            </ImageBackground>
</View>


{/*

<View style={styles.mainContent} >

            <ImageBackground style={{justifyContent: "center",
        alignItems:"center", flex: 1, width: "100%", height:"100%"}} source={require('../assets/images/Designer(2).jpeg')} resizeMode='cover' >
            <View style={ styles.titleContainer}>
            <Text style={ styles.title} >Expert Service </Text>
            <Text style={ styles.title} >for </Text>
            <Text style={ styles.title} >Quality Furniture. </Text>
            </View>
           
              <View style={styles.buttonContainer}>
              <Ionicons name="chevron-forward-circle-outline" size={24} color="black" />
              </View>
            </ImageBackground>
</View>



<View style={styles.mainContent} >

            <ImageBackground style={{justifyContent: "center",
             alignItems:"center", flex: 1, width: "100%", height:"100%"}} source={require('../assets/tran/lovepik-couch-png-image_400985851_wh1200.png')} resizeMode='cover' >
            <View style={ styles.titleContainer}>
            <Text style={ styles.title} >Expert Service </Text>
            <Text style={ styles.title} >for </Text>
            <Text style={ styles.title} >Quality Furniture. </Text>
            </View>
           
              <View style={styles.buttonContainer}>
              <Ionicons name="chevron-forward-circle-outline" size={24} color="black" />
              </View>
            </ImageBackground>
</View>
*/} 



            
        </View>
       
       
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    imageContainer : {
        flex: 1,
        width: "100%",
        height: "100%",
        justifyContent:"center",
        
        padding: 20,
        
        marginBottom: 50,
       
        position: "relative"
    },
    textContainer : {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
       
    },
    mainContent :{
        flex: 1.5,
        flexDirection: "row",
        backgroundColor: "#FBB04B",
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        justifyContent: "center",
        alignItems:"center",
        overflow: "hidden"
        
    },
    titleContainer : {
        position: "absolute",
        top: 30,
        left: 30,
        paddingLeft:5,
        borderLeftWidth: 5,
        borderLeftColor:"white"
    },
    title : {
        fontSize:30, 
        fontWeight:'700', 
        textAlign: 'left',
        color: '#00685C',
        textShadowColor: "#000",
        textShadowRadius: 10,
        textShadowOffset: {width: 3, height: 2}

    },
    buttonContainer : {
        position: "absolute",
        bottom: 30,
        width: 70,
        height: 70,
        backgroundColor: "#fff",
        alignItems : "center",
        justifyContent: "center",
        borderRadius: 50,
        overflow: 'hidden',
        borderWidth: 9,
        borderColor: "rgba(0,0,0,0.2)",
      
    }
});


//make this component available to the app
export default onBoarding;
