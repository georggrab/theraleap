# theraleap
Help patients recover from hand operations by allowing them to do recovery excercises at home by utilizing state of the art hand tracking technology &amp; the modern web.

## 10000 foot view

After carrying out a surgery on the hand, the patient almost always has to undergo some kind of recovery period in order to get the hand mobility back to the original, healthy state. Up until now, the recovery is done in multiple lengthy therapy sessions, requiring both the physical presence of the patient and an ergo therapist.

In a joint venture of the [DHBW Stuttgart](https://www.dhbw-stuttgart.de/home/) and the [Katharinenhospital Stuttgart](https://www.klinikum-stuttgart.de/ueber-uns/startseite/katharinenhospital/), alternative approaches to this are explored: the goal is for the patient to be able to complete some of the recovery exercises at home, saving time and resources for both the patient and the clinic.

## This project

This project is exploring one particular possibility of achieving this: combining low cost hand tracking devices with the modern web. Hand tracking devices are basically small hardware devices with various sensors, capable of producing a virtual representation of the hand. They are usually used for VR Games and Augmented Reality, but can arguably be used to track the post surgery recovery progress of a patient as well. A cheap and popular Hand tracking devices is the [Leap Motion](https://www.leapmotion.com/) tracker. This is the Tracker that is being primarily used for this project, although the project architecture supports implementing different trackers.

The idea of this project is basically to gamify the recovery exercises: the patient should be able to play games through a web interface, controlled by Hand Gestures (for example, spreading the thumb to make a spaceship shoot). The Hand Gestures correspond roughly to recovery exercises that would normally have been done together with a therapist. Now, the idea is that the therapist is configuring gestures for a patient that he or she has to get better at in order to aid in recovery, these gestures must then be used by the patient in order to control the game properly. The gameplay is producing monitoring information for the therapist to review: the goal is that the therapist is able to track the recovery progress of the patient through clever visualization of this monitoring data.

### Getting started

The Web Interface is where everything is wired together: the patient uses it to play games, the therapist uses it to configure games for the patient and look at monitoring information.

This project is implemented in Typescript, with VueJS as a SPA framework.

#### Development Setup

Here is how you get the project up and running on your machine.

##### Getting the Leap Motion Device Driver

The project works out of the box for the Leap Motion Device; other Hand Trackers have to be implemented first, if required. For the project to work, we need the Leap Motion Device Driver. The driver is called `leapd`, and basically implemented as a local, Websockets based server, allowing us to communicate with the Leap Motion Device from a Web context. It can be downloaded for all platforms from [here](https://developer.leapmotion.com/sdk/v2). Note that this project is depending on v2 of the SDK: the newer SDK (Orion v3) is at the time of writing still in beta, and, more importantly, not available cross-platform (windows only).

After installing the Leap Motion Device Driver, start `LeapControlPanel` and make sure the *enable web apps* option is enabled. After that, you should be good to go.

##### Getting the project and dependencies

This is a Webpack based project, nothing special here: 

```bash
git clone https://github.com/talkdirty/theraleap
cd theraleap
npm i
```

##### Running the project

I recommend using `webpack-dev-server` as a local development server:

```
npm i -g webpack-dev-server
webpack-dev-server
```

##### Testing the project

The project is using Karma for unit testing:

```
npm run test
```

# Architecture 
A description of the proposed architecture is outlined below. This is pretty much out of date already in some points, and will be updated shortly.
## Client
The proposed architecture follows a client-server based model. The client (in the following also referred to as “HandTherapy Hub”) is proposed to be implemented through Web Technologies, though other types of implementation, like desktop applications based on the Unity Engine are conceivable. The justification for using Web Technologies is the project requirement that the application should be portable and run on a variety of operating systems and client PCs. Furthermore, the requirement that the therapist part of the application should (continue to) be based on Web Technologies implies that this decision contributes to keeping to a homogenous stack of technologies. Lastly, the fact that modern web development is taught at the DHBW Stuttgart may contribute to achieving the requirement that the system should be easy to modify and extend by other student research projects in the future.
Regardless of implementation technology, the client is proposed to handle the operation of the following tasks.
* Data Flow Management. The client is the communication bridge to the Leap Motion Server, a software distributed and maintained by Leap Motion, Inc. This software is required to be installed and run on the client in order to be able to communicate with the device. The Leap Motion software exposes a local server based on Websocket technology, over which data frames can be received. The data frames contain virtual representations of the arm, hand, and fingers, in case they are positioned correctly over the device. The first client responsibility is to establish a connection to the Leap Motion Server, and to start receiving frames. Next, it may be useful to perform some minor initial data processing tasks at this stage in order to make the data transport that follows more efficient. Conceivable data processing tasks include filtering empty frames or reducing the throughput by averaging multiple frames or simply dropping frames at some interval. The last responsibility of the clients Data Flow Management subsystem is to establish a bidirectional connection stream to the Motion Detector Server, a server component which is described below. The client should stream the (now possibly preprocessed) hand measurements through the connection, and forward the streamed server response to the next client subsystem, the Game Execution Engine.
* Game Execution. The next important subsystem which must be implemented client-side is the Game Execution Engine. An abstraction of the detected gesture is returned by the Motion Detector Server (described below), which indicates if a gesture has been executed successfully. Possible gestures may include extending the thumb from the closed hand, or spreading the hand. If this is the case, some additional meta information regarding the motion execution is also returned, the most important of which being the quality of the executed motion. Note that the Game Execution Engine never explicitly knows which exact gesture was performed. While this may potentially be restrictive in game implementation, a big advantage of this architectural decision is that the detection of new motions can be added to the Motion Detector Server without modifying any code on the client. The Game Execution Engine now maps the received Gestures to input actions in the game. The game itself, which may be implemented using any Web technology based Framework now takes the appropriate action based on the triggered input action.
* Monitoring. The client displays the monitoring information for a therapists patients as supplied by the Monitoring Server, which is described below in further detail.
* Management. Both patients and therapists have access to a management component, which acts as an entry point for playing games, displays general information, and allows the therapist to configure games for the patient. 
## Servers
### Metadata Server
The Metadata Server is comparable to the existing hand therapy solution in functionality. It stores Business Objects representing therapists and patients, models their relations, stores the per-patient game configurations, handles authentication, and messaging. It is the only server component that is required to run in a secure hosted environment (not on the clients PC) for obvious reasons. The specification that the whole system should be able to operate offline implies that the connection to this component must be optional, or be able to happen only sporadically for the purpose of synchronization. 
### Motion Detector Server
The Motion Detector Server receives the raw hand motion data from the clients. It processes the data in appropriate ways and then feeds the refined data into two detection components.
### Motion Detector 
The Motion Detector is responsible for detecting gestures that may be mapped to a specific action that has been undertaken by the patient, such as spreading the fingers of a hand. This specific action may be mapped later to a game input by the Game Execution Engine of the client. Actions of this type are comparable with the actions of normal peripheral devices commonly connected to computers, such as the click of the left button on a computer mouse. The implementation of the gesture detection is designed to be modular, which means in this context that the detection of gestures can be switched on or off by demand, based on which type of gestures currently has to be recognized. Also, new gesture detections must be able to be added to this component easily and in a streamlined fashion.
Position Detector: The Motion Detector may not be able to detect Motions that are based on positional context, such as tilting the hand to some degree in order to achieve a steering action in a game. The Position Detector will, if this differentiation actually requires two separate components, detect these kinds of events.
Finally the gestures and positional data are collected and made available through the Motion Detector API. Simultaneously, the same data, possibly augmented with relevant monitoring information, is forwarded to the Monitoring Server for further analysis.
This server component will be able to be run locally on the client PC, or alternatively in a hosted environment.
Monitoring Server
The Monitoring Server collects the data obtained from the patient playing the game and performs analysis on it. Data is saved in a time series database. The analysis is made available to the client frontend (for both patients and therapists) for progress tracking. 
This server component will be able to be run locally on the client PC, or alternatively in a hosted environment.
