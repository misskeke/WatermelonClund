/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50130
Source Host           : localhost:3306
Source Database       : devwebs

Target Server Type    : MYSQL
Target Server Version : 50130
File Encoding         : 65001

Date: 2014-07-18 13:22:17
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for bar
-- ----------------------------
DROP TABLE IF EXISTS `bar`;
CREATE TABLE `bar` (
  `fid` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `fname` varchar(255) NOT NULL,
  `fallow_num` bigint(20) unsigned NOT NULL DEFAULT '0',
  `thread_num` bigint(20) unsigned NOT NULL DEFAULT '0',
  `background` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT 'pid',
  `gms` text NOT NULL,
  `signnum` bigint(20) unsigned NOT NULL DEFAULT '0',
  `lastsign` bigint(20) unsigned NOT NULL DEFAULT '0',
  `headpic` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT 'picid',
  `state` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '0=正常 1=冻结 2=仅吧务发言 3=查封 4=正在整理',
  `last_editstate_doid` bigint(20) unsigned NOT NULL DEFAULT '0',
  `ct` varchar(400) NOT NULL DEFAULT '' COMMENT '简介',
  `swlinks` varchar(800) NOT NULL DEFAULT '' COMMENT '相关链接（帖子）',
  PRIMARY KEY (`fid`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of bar
-- ----------------------------

-- ----------------------------
-- Table structure for managing
-- ----------------------------
DROP TABLE IF EXISTS `managing`;
CREATE TABLE `managing` (
  `doid` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `target` bigint(20) unsigned NOT NULL,
  `type` mediumint(8) unsigned NOT NULL,
  `doer` bigint(20) unsigned NOT NULL,
  `desc` text NOT NULL,
  `time` bigint(20) unsigned NOT NULL,
  `ip` varchar(255) NOT NULL,
  `undoned` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `undone_desc` text NOT NULL,
  `undone_user` bigint(20) unsigned NOT NULL DEFAULT '0',
  `undone_ip` varchar(255) NOT NULL DEFAULT '0.0.0.0',
  PRIMARY KEY (`doid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of managing
-- ----------------------------

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
  PRIMARY KEY (`picid`)
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
  PRIMARY KEY (`sid`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of session
-- ----------------------------
INSERT INTO `session` VALUES ('1', '1', 'neOy7Sb0o5B0MC2Wh4WBXlw4utBY2FiE', '1', '192.168.0.2', '1405577339');
INSERT INTO `session` VALUES ('2', '1', '51gy66E7I8Lc29Qb88YS7UDpffgTkZI2', '1', '192.168.0.2', '1405587490');
INSERT INTO `session` VALUES ('3', '1', 'S83M9T79dVgx65CN5kwbos0wgqtUr68M', '0', '172.17.28.2', '1405607371');
INSERT INTO `session` VALUES ('4', '1', 'tRspKSwP3fc962hY3TeoYw5j771u7U07', '1', '192.168.0.2', '1405649077');
INSERT INTO `session` VALUES ('5', '2', 'FYVPh4RwQZu5M9tzKNYeOwkNhkyB0VjR', '0', '192.168.0.2', '1405660894');

-- ----------------------------
-- Table structure for ssr
-- ----------------------------
DROP TABLE IF EXISTS `ssr`;
CREATE TABLE `ssr` (
  `ssrid` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `type` smallint(5) unsigned NOT NULL COMMENT '1=回复',
  `time` bigint(20) unsigned NOT NULL,
  `maker` bigint(20) unsigned NOT NULL,
  `recer` bigint(20) unsigned NOT NULL,
  `target` bigint(20) unsigned NOT NULL,
  `makeby` bigint(20) unsigned NOT NULL,
  `showed` tinyint(3) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`ssrid`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of ssr
-- ----------------------------
INSERT INTO `ssr` VALUES ('1', '1', '1405577360', '1', '1', '1', '2', '1');
INSERT INTO `ssr` VALUES ('2', '1', '1405608427', '1', '1', '3', '6', '1');
INSERT INTO `ssr` VALUES ('3', '1', '1405656619', '1', '1', '3', '10', '1');

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
  `del_doid` bigint(20) unsigned NOT NULL DEFAULT '0',
  `ban_because_this` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `ban_because_this_doid` bigint(20) unsigned NOT NULL DEFAULT '0',
  `type` tinyint(3) unsigned NOT NULL COMMENT '1=推子',
  `content` mediumtext NOT NULL,
  `fid` bigint(20) unsigned NOT NULL,
  `reply_tid` bigint(20) unsigned NOT NULL,
  `state` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '0=普通 1=精华 2=置顶 3=精华+置顶 4=回复置顶',
  `zan_num` bigint(20) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`tid`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of thread
-- ----------------------------
INSERT INTO `thread` VALUES ('1', '1', '192.168.0.2', '1405577351', '', '0', '0', '0', '0', '1', '= =', '0', '0', '0', '0');
INSERT INTO `thread` VALUES ('2', '1', '192.168.0.2', '1405577360', '', '0', '0', '0', '0', '1', 'å›žå¤ çŽ‹åº­èŒ‚ : = =', '0', '1', '0', '0');
INSERT INTO `thread` VALUES ('3', '1', '192.168.0.2', '1405592841', '', '0', '0', '0', '0', '1', 'å‘€', '0', '0', '0', '0');
INSERT INTO `thread` VALUES ('4', '1', '192.168.0.2', '1405592856', '', '0', '0', '0', '0', '1', 'å‘€- -', '0', '3', '0', '0');
INSERT INTO `thread` VALUES ('5', '1', '192.168.0.2', '1405592915', '', '0', '0', '0', '0', '1', '- -', '0', '3', '0', '0');
INSERT INTO `thread` VALUES ('6', '1', '172.17.28.2', '1405608427', '', '0', '0', '0', '0', '1', 'å›žå¤ çŽ‹åº­èŒ‚ : - -', '0', '3', '0', '0');
INSERT INTO `thread` VALUES ('7', '1', '192.168.0.2', '1405649089', '', '0', '0', '0', '0', '1', '- -', '0', '0', '0', '0');
INSERT INTO `thread` VALUES ('8', '1', '192.168.0.2', '1405649110', '', '0', '0', '0', '0', '1', '0 0', '0', '0', '0', '0');
INSERT INTO `thread` VALUES ('9', '1', '192.168.0.2', '1405649153', '', '1', '0', '0', '0', '1', '0 0', '0', '0', '0', '0');
INSERT INTO `thread` VALUES ('10', '1', '192.168.0.2', '1405656619', '', '0', '0', '0', '0', '1', 'å›žå¤ çŽ‹åº­èŒ‚ : - -', '0', '3', '0', '0');

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
  `group` smallint(6) unsigned NOT NULL DEFAULT '0' COMMENT '0=用户 1=管理组',
  `mailmd5` varchar(64) NOT NULL,
  PRIMARY KEY (`uid`,`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', 'çŽ‹åº­èŒ‚', 'ICAgICAg', 'wtmtim@126.com', '0', '192.168.0.2', '1405577335', '0', '0', '0', '0', '56876e747c1df2ec78bac869ccf64fea');
INSERT INTO `user` VALUES ('2', 'æµ‹è¯•', 'ICAgICAg', 'wtmtim@126.com', '0', '192.168.0.2', '1405660891', '0', '0', '0', '0', '56876e747c1df2ec78bac869ccf64fea');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user_extra
-- ----------------------------
