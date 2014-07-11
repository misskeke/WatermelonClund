/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50130
Source Host           : localhost:3306
Source Database       : devwebs

Target Server Type    : MYSQL
Target Server Version : 50130
File Encoding         : 65001

Date: 2014-07-11 22:47:02
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for pics
-- ----------------------------
DROP TABLE IF EXISTS `pics`;
CREATE TABLE `pics` (
  `picid` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `authoruid` bigint(20) unsigned NOT NULL,
  `updip` varchar(255) NOT NULL,
  `time` bigint(20) unsigned NOT NULL,
  `deleted` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `src` longtext NOT NULL COMMENT '外链URL',
  `zan` bigint(20) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`picid`),
  KEY `authoruid` (`authoruid`),
  KEY `updip` (`updip`),
  KEY `time` (`time`),
  KEY `deleted` (`deleted`),
  KEY `useament` (`zan`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of pics
-- ----------------------------

-- ----------------------------
-- Table structure for session
-- ----------------------------
DROP TABLE IF EXISTS `session`;
CREATE TABLE `session` (
  `sid` bigint(20) NOT NULL AUTO_INCREMENT,
  `uid` bigint(20) NOT NULL,
  `krr` varchar(255) NOT NULL,
  `shuted` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '0=false 1=true',
  `ip` varchar(255) NOT NULL,
  `time` bigint(20) NOT NULL,
  PRIMARY KEY (`sid`),
  KEY `index` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of session
-- ----------------------------

-- ----------------------------
-- Table structure for thread
-- ----------------------------
DROP TABLE IF EXISTS `thread`;
CREATE TABLE `thread` (
  `tid` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uid` bigint(20) unsigned NOT NULL,
  `ip` varchar(255) NOT NULL,
  `time` bigint(20) unsigned NOT NULL,
  `title` varchar(255) NOT NULL,
  `deleted` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `del_usr` bigint(20) NOT NULL,
  `del_rsn` varchar(400) NOT NULL,
  `ban_because_this` tinyint(3) unsigned NOT NULL,
  `ban_because_this_banid` bigint(20) NOT NULL,
  `type` tinyint(3) unsigned NOT NULL COMMENT '0=主题贴 1=推子 2=回复',
  `content` mediumtext NOT NULL,
  `fid` bigint(20) unsigned NOT NULL,
  `reply_tid` bigint(20) unsigned NOT NULL,
  `state` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '0=普通 1=精华 2=置顶 3=精华+置顶 4=回复置顶',
  `zan_usr` mediumtext NOT NULL COMMENT 'uid uid uid uid ......',
  `zan_num` bigint(20) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`tid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of thread
-- ----------------------------
INSERT INTO `thread` VALUES ('1', '0', '0.0.0.0', '0', '', '0', '0', '', '0', '0', '1', 'Hello World!', '0', '0', '0', '', '0');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `uid` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `sex` tinyint(3) unsigned NOT NULL COMMENT '0=未设置 1=男 2=女 3=秀吉 4=女汉 5=其他 6=bot',
  `registerip` varchar(255) NOT NULL,
  `registerTime` bigint(20) unsigned NOT NULL COMMENT '时间戳',
  `QQ` varchar(255) NOT NULL,
  `emailCorrented` tinyint(3) unsigned NOT NULL COMMENT '0=False 1=True',
  `state` tinyint(3) unsigned NOT NULL COMMENT '0=正常 1=封禁 2=屏蔽 3=强屏+封禁 4=不允许登录 5=即将删除',
  PRIMARY KEY (`uid`,`username`,`email`),
  KEY `password` (`password`,`sex`,`registerip`,`registerTime`,`QQ`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------

-- ----------------------------
-- Table structure for user_extra
-- ----------------------------
DROP TABLE IF EXISTS `user_extra`;
CREATE TABLE `user_extra` (
  `eid` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uid` bigint(20) unsigned NOT NULL,
  `ename` varchar(100) NOT NULL,
  `evalue` varchar(100) NOT NULL,
  `ip` varchar(255) NOT NULL,
  `time` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`eid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of user_extra
-- ----------------------------
