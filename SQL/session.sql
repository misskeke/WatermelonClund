/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50703
Source Host           : localhost:3306
Source Database       : websjiecao

Target Server Type    : MYSQL
Target Server Version : 50703
File Encoding         : 65001

Date: 2014-07-04 08:39:23
*/

SET FOREIGN_KEY_CHECKS=0;

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
