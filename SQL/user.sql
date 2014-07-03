/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50703
Source Host           : localhost:3306
Source Database       : websjiecao

Target Server Type    : MYSQL
Target Server Version : 50703
File Encoding         : 65001

Date: 2014-07-03 23:17:12
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `uid` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `sex` tinyint(3) unsigned NOT NULL COMMENT '0=未设置 1=男 2=女 3=秀吉 4=女汉 5=其他',
  `registerip` varchar(255) NOT NULL,
  `registerTime` bigint(20) unsigned NOT NULL COMMENT '时间戳',
  `QQ` varchar(255) NOT NULL,
  `emailCorrented` tinyint(3) unsigned NOT NULL COMMENT '0=False 1=True',
  `state` tinyint(3) unsigned NOT NULL COMMENT '0=正常 1=封禁 2=屏蔽 3=强屏+封禁 4=不允许登录 5=即将删除',
  PRIMARY KEY (`uid`,`username`,`email`),
  KEY `password` (`password`,`sex`,`registerip`,`registerTime`,`QQ`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
