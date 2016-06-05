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

libraryDependencies += "org.json" % "json" % "20160212"





