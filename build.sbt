name := """bat"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayJava).enablePlugins(PlayEbean)

scalaVersion := "2.11.7"

libraryDependencies ++= Seq(
  jdbc,
  evolutions,
  cache,
  ws,
  "com.restfb" % "restfb" % "1.6.16",
  "com.pauldijou" %% "jwt-play" % "0.9.0",
  "org.postgresql" % "postgresql" % "9.4-1201-jdbc41",
  "mysql" % "mysql-connector-java" % "6.0.4"
)

libraryDependencies += "org.json" % "json" % "20160212"





