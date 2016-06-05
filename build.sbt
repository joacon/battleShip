name := """bat"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayJava)

scalaVersion := "2.11.7"

libraryDependencies ++= Seq(
  javaJdbc,
  cache,
  javaWs,
  "com.restfb" % "restfb" % "1.6.16"
)

// http://mvnrepository.com/artifact/com.feth/play-authenticate_2.11
//libraryDependencies += "com.feth" % "play-authenticate_2.11" % "0.7.1"

// http://mvnrepository.com/artifact/ws.securesocial/securesocial_2.11
//libraryDependencies += "ws.securesocial" % "securesocial_2.11" % "3.0-M4"


// http://mvnrepository.com/artifact/com.restfb/restfb
//libraryDependencies += "com.restfb" % "restfb" % "1.24.0"
